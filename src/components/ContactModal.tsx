import { useState } from 'react'
import { X, MessageCircle, Instagram, Mail } from 'lucide-react'

interface ContactModalProps {
  open: boolean
  onClose: () => void
  whatsappLink: string
  instagramLink: string
  email: string
}

export const ContactModal = ({ open, onClose, whatsappLink, instagramLink, email }: ContactModalProps) => {
  if (!open) return null

  const channels = [
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      description: 'Resposta rápida em minutos',
      href: whatsappLink,
      color: 'hsl(142 72% 48%)',
      bg: 'hsl(142 72% 48% / 0.12)',
    },
    {
      icon: Instagram,
      label: 'Instagram',
      description: 'DM no @focussdev',
      href: instagramLink,
      color: 'hsl(330 80% 60%)',
      bg: 'hsl(330 80% 60% / 0.12)',
    },
    {
      icon: Mail,
      label: 'E-mail',
      description: email,
      href: `mailto:${email}`,
      color: 'hsl(210 80% 60%)',
      bg: 'hsl(210 80% 60% / 0.12)',
    },
  ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl animate-scale-in"
        style={{ boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.6)' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-foreground">Como prefere falar comigo?</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Escolha o canal mais confortável pra você
          </p>
        </div>

        {/* Channels */}
        <div className="flex flex-col gap-3">
          {channels.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="group flex items-center gap-4 rounded-xl border border-border p-4 hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: 'hsl(var(--secondary) / 0.5)' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{ background: channel.bg }}
              >
                <channel.icon className="w-5 h-5" style={{ color: channel.color }} />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{channel.label}</p>
                <p className="text-xs text-muted-foreground">{channel.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
