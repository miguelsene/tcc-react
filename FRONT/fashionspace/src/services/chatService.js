const API_BASE_URL = 'http://localhost:8080/api';

export const chatService = {
  // Enviar mensagem
  async sendMessage(messageData) {
    const response = await fetch(`${API_BASE_URL}/mensagens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData)
    });
    
    if (!response.ok) {
      throw new Error('Erro ao enviar mensagem');
    }
    
    return response.json();
  },

  // Buscar conversa entre usuário e bazar
  async getConversation(userId, bazarId) {
    const response = await fetch(`${API_BASE_URL}/mensagens/conversa/${userId}/${bazarId}`);
    
    if (!response.ok) {
      throw new Error('Erro ao carregar conversa');
    }
    
    return response.json();
  },

  // Buscar mensagens recebidas
  async getReceivedMessages(userId) {
    const response = await fetch(`${API_BASE_URL}/mensagens/recebidas/${userId}`);
    
    if (!response.ok) {
      throw new Error('Erro ao carregar mensagens recebidas');
    }
    
    return response.json();
  },

  // Buscar mensagens enviadas
  async getSentMessages(userId) {
    const response = await fetch(`${API_BASE_URL}/mensagens/enviadas/${userId}`);
    
    if (!response.ok) {
      throw new Error('Erro ao carregar mensagens enviadas');
    }
    
    return response.json();
  },

  // Contar mensagens não lidas
  async getUnreadCount(userId) {
    const response = await fetch(`${API_BASE_URL}/mensagens/nao-lidas/${userId}`);
    
    if (!response.ok) {
      throw new Error('Erro ao contar mensagens não lidas');
    }
    
    return response.json();
  },

  // Marcar mensagem como lida
  async markAsRead(messageId) {
    const response = await fetch(`${API_BASE_URL}/mensagens/marcar-lida/${messageId}`, {
      method: 'PUT'
    });
    
    if (!response.ok) {
      throw new Error('Erro ao marcar mensagem como lida');
    }
  },

  // Marcar conversa como lida
  async markConversationAsRead(userId, bazarId) {
    const response = await fetch(`${API_BASE_URL}/mensagens/marcar-conversa-lida/${userId}/${bazarId}`, {
      method: 'PUT'
    });
    
    if (!response.ok) {
      throw new Error('Erro ao marcar conversa como lida');
    }
  },

  // Buscar mensagens de um bazar
  async getBazarMessages(bazarId) {
    const response = await fetch(`${API_BASE_URL}/mensagens/bazar/${bazarId}`);
    
    if (!response.ok) {
      throw new Error('Erro ao carregar mensagens do bazar');
    }
    
    return response.json();
  },

  // Buscar todas as conversas do usuário (otimizado)
  async getAllConversations(userId, userType = 'casual') {
    const endpoint = userType === 'dono' ? 
      `${API_BASE_URL}/mensagens/conversas-dono/${userId}` : 
      `${API_BASE_URL}/mensagens/conversas/${userId}`;
      
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error('Erro ao carregar conversas');
    }
    
    return response.json();
  }
};