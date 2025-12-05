// Controlador da Home
// Serve os dados para o ecrã principal.

// Devolve o resumo para a Home (próximas consultas, dados do user).
export const getHomeResumo = async (req, res) => {
  try {
    // Mock de dados
    res.status(200).json({
      utilizador: {
        id: 1,
        nome: "Utilizador Teste",
        numeroUtente: "12345"
      },
      proximasConsultas: [] // Lista vazia por agora
    });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao obter dados da home" });
  }
};
