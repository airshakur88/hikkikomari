"use client";

import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const contactOptions = [
  { value: "discord", label: "Discord", placeholder: "@usuario" },
  { value: "instagram", label: "Instagram", placeholder: "@usuario" },
  { value: "twitter", label: "Twitter", placeholder: "@usuario" },
  { value: "tiktok", label: "TikTok", placeholder: "@usuario" },
  { value: "email", label: "Email", placeholder: "email@exemplo.com" },
  { value: "whatsapp", label: "WhatsApp", placeholder: "+55 11 99999-9999" },
] as const;

type ContactMethod = (typeof contactOptions)[number]["value"];

export function ContactForm() {
  const [name, setName] = useState("");
  const [contactMethod, setContactMethod] = useState<ContactMethod>("discord");
  const [contact, setContact] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const activePlaceholder =
    contactOptions.find((o) => o.value === contactMethod)?.placeholder ?? "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contactMethod: contactOptions.find((o) => o.value === contactMethod)
            ?.label,
          contact,
          subject,
          message,
        }),
      });

      if (res.ok) {
        setStatus("success");
        setName("");
        setContact("");
        setSubject("");
        setMessage("");
        setContactMethod("discord");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col gap-3 sm:gap-4"
    >
      <div className="flex flex-col gap-3 sm:gap-4 px-6">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-name">Nome</Label>
          <Input
            id="contact-name"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-method">Forma de contato</Label>
          <Select
            value={contactMethod}
            onValueChange={(v) => setContactMethod(v as ContactMethod)}
          >
            <SelectTrigger id="contact-method" className="w-full border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {contactOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-value">Contato</Label>
          <Input
            id="contact-value"
            placeholder={activePlaceholder}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-subject">Assunto</Label>
          <Input
            id="contact-subject"
            placeholder="Assunto da mensagem"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <Separator className="opacity-0 sm:opacity-100" />

        <div className="flex min-h-0 flex-1 flex-col gap-1.5">
          <Label htmlFor="contact-message">Mensagem</Label>
          <Textarea
            id="contact-message"
            placeholder="Escreva sua mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 250))}
            required
            rows={8}
            maxLength={250}
            className="min-h-40 sm:min-h-56 md:min-h-64 rounded-none border border-input focus-visible:ring-0 focus-visible:border-input resize-none"
          />
          <p className="text-right text-xs text-muted-foreground">{message.length}/250</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-auto px-6 pb-6">
        {status === "success" && (
          <p className="text-sm text-primary">
            Mensagem enviada com sucesso! ♡
          </p>
        )}
        {status === "error" && (
          <p className="text-sm text-destructive">
            Erro ao enviar. Tente novamente.
          </p>
        )}
        <Button
          type="submit"
          disabled={loading}
          variant="default"
          className="w-full h-8 rounded-none cursor-pointer gap-2 hover:bg-border transition-colors duration-300 text-sm"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Send />}
          Enviar
        </Button>
      </div>
    </form>
  );
}