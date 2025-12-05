// Controlador de Contactos
// Informação estática da clínica.

export const getContactos = async (req, res) => {
  res.status(200).json({
    email: "clinimolelos@gmail.com",
    telefone: "+351 239 393 607",
    redesSociais: {
      facebook: "Clinimolelos"
    },
    endereco: {
      rua: "Av. Dr. Adriano Elísio...",
      localidade: "Tondela"
    }
  });
};
