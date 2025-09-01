import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Profissional } from '../profissional/entities/profissional.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { LoginDto, RegisterDto, JwtPayload } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Profissional)
    private profissionalRepository: Repository<Profissional>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ access_token: string; refresh_token: string; user: any }> {
    const { email, senha, nome, tipo, cpf, crm, especialidade } = registerDto;

    // Verificar se o usuário já existe
    let existingUser;
    if (tipo === 'profissional') {
      existingUser = await this.profissionalRepository.findOne({ where: { email } });
    } else {
      existingUser = await this.clienteRepository.findOne({ where: { email } });
    }

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Hash da senha
    const hashedSenha = await bcrypt.hash(senha, 12);

    let savedUser;
    if (tipo === 'profissional') {
      const profissional = this.profissionalRepository.create({
        email,
        password: hashedSenha,
        name: nome,
        type: 'profissional',
        cpf,
        especialidade,
        admin: false,
      });
      savedUser = await this.profissionalRepository.save(profissional);
    } else {
      const cliente = this.clienteRepository.create({
        email,
        password: hashedSenha,
        name: nome,
        type: 'cliente',
        cpf,
        cell: '',
        address: '',
      });
      savedUser = await this.clienteRepository.save(cliente);
    }

    // Gerar JWT
    const token = this.generateToken(savedUser);
    const refreshToken = this.generateRefreshToken(savedUser);

    // Retornar usuário sem senha
    const { password: _, ...userWithoutSenha } = savedUser;
    
    // Estruturar resposta conforme esperado pelo frontend
    const response = {
      access_token: token,
      refresh_token: refreshToken,
      user: {
        id: userWithoutSenha.id,
        email: userWithoutSenha.email,
        nome: userWithoutSenha.name, // Mapear 'name' para 'nome'
        tipo: userWithoutSenha.type, // Mapear 'type' para 'tipo'
        cpf: userWithoutSenha.cpf,
        birthDate: userWithoutSenha.birthDate,
        cell: userWithoutSenha.cell,
        address: userWithoutSenha.address,
        especialidade: userWithoutSenha.especialidade,
        admin: userWithoutSenha.admin,
        cnec: userWithoutSenha.cnec
      }
    };
    
    console.log('🔍 Debug - Resposta do registro:', response);
    return response;
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string; refresh_token: string; user: any }> {
    const { email, senha, userType } = loginDto;
    
    console.log('🔍 Debug - Login attempt:', { email, userType });
    console.log('🔍 Debug - Senha recebida:', senha);

    let user;
    
    // Buscar usuário baseado no tipo especificado ou tentar ambos
    if (userType === 'profissional') {
      user = await this.profissionalRepository.findOne({ where: { email } });
      console.log('🔍 Debug - Buscando profissional:', user ? 'Encontrado' : 'Não encontrado');
    } else if (userType === 'cliente') {
      user = await this.clienteRepository.findOne({ where: { email } });
      console.log('🔍 Debug - Buscando cliente:', user ? 'Encontrado' : 'Não encontrado');
    } else {
      // Se não especificado, tentar ambos
      user = await this.profissionalRepository.findOne({ where: { email } });
      if (!user) {
        user = await this.clienteRepository.findOne({ where: { email } });
      }
      console.log('🔍 Debug - Buscando ambos tipos:', user ? 'Encontrado' : 'Não encontrado');
    }

    if (!user) {
      console.log('❌ Debug - Usuário não encontrado');
      throw new UnauthorizedException('Credenciais inválidas');
    }

    console.log('🔍 Debug - Usuário encontrado:', { id: user.id, email: user.email, type: user.type });
    console.log('🔍 Debug - Senha hash no banco:', user.password);

    // Verificar senha
    const isSenhaValid = await bcrypt.compare(senha, user.password);
    console.log('🔍 Debug - Senha válida:', isSenhaValid);
    
    if (!isSenhaValid) {
      console.log('❌ Debug - Senha inválida');
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gerar JWT
    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Retornar usuário sem senha
    const { password: _, ...userWithoutSenha } = user;
    
    // Estruturar resposta conforme esperado pelo frontend
    const response = {
      access_token: token,
      refresh_token: refreshToken,
      user: {
        id: userWithoutSenha.id,
        email: userWithoutSenha.email,
        nome: userWithoutSenha.name, // Mapear 'name' para 'nome'
        tipo: userWithoutSenha.type, // Mapear 'type' para 'tipo'
        cpf: userWithoutSenha.cpf,
        birthDate: userWithoutSenha.birthDate,
        cell: userWithoutSenha.cell,
        address: userWithoutSenha.address,
        especialidade: userWithoutSenha.especialidade,
        admin: userWithoutSenha.admin,
        cnec: userWithoutSenha.cnec
      }
    };
    
    console.log('🔍 Debug - Resposta do login:', response);
    return response;
  }

  async loginProfissional(loginDto: LoginDto): Promise<{ access_token: string; refresh_token: string; user: any }> {
    // Forçar o tipo para profissional
    const loginData: LoginDto = { 
      ...loginDto, 
      userType: 'profissional' as const 
    };
    return this.login(loginData);
  }

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret' });
      
      // Buscar usuário baseado no tipo
      let user;
      if (payload.tipo === 'profissional') {
        user = await this.profissionalRepository.findOne({ where: { id: payload.sub } });
      } else {
        user = await this.clienteRepository.findOne({ where: { id: payload.sub } });
      }
      
      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      const newToken = this.generateToken(user);
      return { token: newToken };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  async validateUser(userId: number, tipo: string): Promise<any> {
    let user;
    if (tipo === 'profissional') {
      user = await this.profissionalRepository.findOne({ where: { id: userId } });
    } else {
      user = await this.clienteRepository.findOne({ where: { id: userId } });
    }
    
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    return user;
  }

  private generateToken(user: any): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      tipo: user.type,
    };

    return this.jwtService.sign(payload, { 
      secret: process.env.JWT_SECRET || 'jwt-secret',
      expiresIn: '1h'
    });
  }

  private generateRefreshToken(user: any): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      tipo: user.type,
    };

    return this.jwtService.sign(payload, { 
      secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      expiresIn: '7d'
    });
  }
}
