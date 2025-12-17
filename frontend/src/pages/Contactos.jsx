// Página de Contactos
// Mostra a informação de contacto da clínica
// Usa Navbar comum à aplicação
// Inclui ícones e mapa (apenas no web via CSS)

import React, { useEffect, useState } from "react";
import { Navbar } from "../components";
import api from "../services/api";

// Ícones
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaLinkedin
} from "react-icons/fa";

import "./Contactos.css";

function Contactos() {
  const [contactos, setContactos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchContactos = async () => {
      setLoading(true);
      setError("");

      try {
        // 🔴 Backend ainda com erro 500
        // 👉 Mock temporário para desenvolvimento visual
        setContactos({
          email: "clinimolelos@gmail.com",
          telefone: "+351 239 393 607",
          telemovel: "+351 912 345 678",
          facebook: "Clinimolelos",
          instagram: "@Clinimolelos",
          linkedin: "Clinimolelos",
          morada: "Av. Dr. Adriano Figueiredo 158, 3460-009 Tondela",
          linkGoogleMaps:
            "https://www.google.com/maps/embed?pb=..."
        });
      } catch (err) {
        if (!cancelled) {
          console.error("Erro ao carregar contactos:", err);
          setError("Não foi possível carregar os contactos.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchContactos();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="contactos-container">
      {/* Navbar */}
      <Navbar variant="utente" />

      <main className="contactos-main">
        {/* Título */}
        <header className="contactos-header">
          <h1 className="contactos-title">CONTACTOS</h1>
        </header>

        {/* Loading */}
        {loading && <p>A carregar contactos...</p>}

        {/* Erro */}
        {!loading && error && <p className="error">{error}</p>}

        {/* Conteúdo */}
        {!loading && contactos && (
          <div className="contactos-card">
            {/* Informação */}
            <div className="contactos-info">
              <h3>Telefone e Email</h3>

              <p>
                <FaEnvelope className="contactos-icon" />
                {contactos.email}
              </p>

              <p>
                <FaPhoneAlt className="contactos-icon" />
                {contactos.telefone}
              </p>

              <h3>Redes Sociais</h3>

              <p>
                <FaFacebook className="contactos-icon" />
                {contactos.facebook}
              </p>

              <p>
                <FaInstagram className="contactos-icon" />
                {contactos.instagram}
              </p>

              <p>
                <FaLinkedin className="contactos-icon" />
                {contactos.linkedin}
              </p>

              <h3>Endereço</h3>

              <p>
                <FaMapMarkerAlt className="contactos-icon" />
                {contactos.morada}
              </p>
            </div>

            {/* Mapa (web apenas) */}
            <div className="contactos-mapa">
              <iframe
                src={contactos.linkGoogleMaps}
                title="Mapa da Clínica"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <p>Clinimolelos 2025 - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default Contactos;
