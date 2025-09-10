export const defaultBazares = [
  {
    id: 'default-1',
    nome: 'Bazar da Moda Vintage',
    descricao: 'Peças únicas e autênticas dos anos 70, 80 e 90. Encontre tesouros vintage com história e estilo.',
    imagem: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
    categoria: 'Vintage',
    endereco: {
      cep: '01310-100',
      rua: 'Rua Augusta',
      numero: '1234',
      bairro: 'Consolação',
      cidade: 'São Paulo, SP'
    },
    telefone: '(11) 99999-1234',
    horario: 'Seg-Sex: 9h-18h, Sáb: 9h-15h',
    isDefault: true
  },
  {
    id: 'default-2',
    nome: 'Outlet Independente',
    descricao: 'Marcas independentes com preços especiais. Apoie designers locais e encontre peças exclusivas.',
    imagem: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500',
    categoria: 'Outlet',
    endereco: {
      cep: '22071-900',
      rua: 'Rua Visconde de Pirajá',
      numero: '567',
      bairro: 'Ipanema',
      cidade: 'Rio de Janeiro, RJ'
    },
    telefone: '(21) 98888-5678',
    horario: 'Seg-Dom: 10h-20h',
    isDefault: true
  },
  {
    id: 'default-3',
    nome: 'Feira de Artesãos',
    descricao: 'Peças artesanais únicas feitas à mão. Bolsas, acessórios e roupas com identidade brasileira.',
    imagem: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500',
    categoria: 'Artesanal',
    endereco: {
      cep: '40070-110',
      rua: 'Largo do Pelourinho',
      numero: '89',
      bairro: 'Pelourinho',
      cidade: 'Salvador, BA'
    },
    telefone: '(71) 97777-9012',
    horario: 'Ter-Dom: 8h-17h',
    isDefault: true
  }
];

export const categorias = [
  { id: 'luxo', nome: 'Bazar de Luxo', cor: '#8B5CF6' },
  { id: 'sebo', nome: 'Sebo', cor: '#F59E0B' },
  { id: 'vintage', nome: 'Vintage', cor: '#EF4444' },
  { id: 'outlet', nome: 'Outlet', cor: '#10B981' },
  { id: 'artesanal', nome: 'Artesanal', cor: '#F97316' },
  { id: 'infantil', nome: 'Infantil', cor: '#EC4899' },
  { id: 'fitness', nome: 'Fitness', cor: '#3B82F6' }
];