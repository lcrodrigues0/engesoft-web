"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  nextSubmissionPublicId,
  type SubmittedArticle,
  type SubmittedArticleAuthor,
} from "@/lib/articles/submitted-articles";
import { journalEditions } from "@/lib/journals/editions";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";

type AuthorDraft = {
  id: string;
  fullName: string;
  email: string;
  institutionName: string;
  institutionAddress: string;
};

function emptyAuthor(): AuthorDraft {
  return {
    id: crypto.randomUUID(),
    fullName: "",
    email: "",
    institutionName: "",
    institutionAddress: "",
  };
}

type SubmitArticleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingArticles: SubmittedArticle[];
  onSubmitted: (article: SubmittedArticle) => void;
};

function editionLabel(e: (typeof journalEditions)[number]) {
  return `${e.theme} — ${e.month}/${e.year} • v.${e.volume} n.${e.number}`;
}

export function SubmitArticleDialog({
  open,
  onOpenChange,
  existingArticles,
  onSubmitted,
}: SubmitArticleDialogProps) {
  const formId = useId();
  const [editionId, setEditionId] = useState(journalEditions[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [authors, setAuthors] = useState<AuthorDraft[]>(() => [emptyAuthor()]);
  const [contactAuthorId, setContactAuthorId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setEditionId(journalEditions[0]?.id ?? "");
    setTitle("");
    setFile(null);
    const first = emptyAuthor();
    setAuthors([first]);
    setContactAuthorId(first.id);
    setFormError(null);
  }, []);

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open, resetForm]);

  useEffect(() => {
    if (authors.length === 1) {
      setContactAuthorId(authors[0]!.id);
    } else if (
      contactAuthorId &&
      !authors.some((a) => a.id === contactAuthorId)
    ) {
      setContactAuthorId(authors[0]!.id);
    }
  }, [authors, contactAuthorId]);

  function addAuthor() {
    setAuthors((prev) => [...prev, emptyAuthor()]);
  }

  function removeAuthor(id: string) {
    setAuthors((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((a) => a.id !== id);
      if (contactAuthorId === id) setContactAuthorId(next[0]!.id);
      return next;
    });
  }

  function updateAuthor(id: string, patch: Partial<AuthorDraft>) {
    setAuthors((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const edition = journalEditions.find((x) => x.id === editionId);
    if (!edition) {
      setFormError("Selecione uma edição da revista.");
      return;
    }
    const t = title.trim();
    if (t.length < 3) {
      setFormError("Informe um título com pelo menos 3 caracteres.");
      return;
    }
    if (!file) {
      setFormError("Anexe o arquivo do artigo.");
      return;
    }

    for (let i = 0; i < authors.length; i++) {
      const a = authors[i]!;
      if (!a.fullName.trim()) {
        setFormError(`Preencha o nome do autor ${i + 1}.`);
        return;
      }
      if (!a.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email.trim())) {
        setFormError(`Informe um e-mail válido para o autor ${i + 1}.`);
        return;
      }
      if (!a.institutionName.trim()) {
        setFormError(`Informe a instituição do autor ${i + 1}.`);
        return;
      }
      if (!a.institutionAddress.trim()) {
        setFormError(`Informe o endereço da instituição do autor ${i + 1}.`);
        return;
      }
    }

    if (authors.length > 1) {
      const contactOk = authors.some((a) => a.id === contactAuthorId);
      if (!contactOk || !contactAuthorId) {
        setFormError("Indique um autor como contato.");
        return;
      }
    }

    const authorDetails: SubmittedArticleAuthor[] = authors.map((a) => ({
      fullName: a.fullName.trim(),
      email: a.email.trim(),
      institutionName: a.institutionName.trim(),
      institutionAddress: a.institutionAddress.trim(),
      isContact: authors.length === 1 || a.id === contactAuthorId,
    }));

    const displayAuthors = authorDetails.map((a) =>
      a.isContact && authors.length > 1
        ? `${a.fullName} (contato)`
        : a.fullName,
    );

    const fileUrl = URL.createObjectURL(file);
    const article: SubmittedArticle = {
      publicId: nextSubmissionPublicId(existingArticles),
      title: t,
      status: "under_review",
      journalName: edition.theme,
      submittedAt: new Date().toISOString(),
      authors: displayAuthors,
      authorDetails,
      fileName: file.name,
      fileUrl,
    };

    onSubmitted(article);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex max-h-[min(92dvh,44rem)] max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden p-0",
          "sm:max-w-xl md:max-w-2xl",
        )}
        showCloseButton
      >
        <DialogHeader className="shrink-0 border-b border-border/60 px-4 pb-3 pt-4 pr-12">
          <DialogTitle className="text-lg font-semibold">Submeter artigo</DialogTitle>
          <DialogDescription className="text-left text-sm">
            Envie o manuscrito para uma edição específica. Cada artigo recebe um número de
            identificação. Com mais de um autor, escolha um como contato.
          </DialogDescription>
        </DialogHeader>

        <form
          id={formId}
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {formError ? (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200">
                {formError}
              </p>
            ) : null}

            <div className="grid gap-1.5">
              <Label htmlFor={`${formId}-edition`}>Edição da revista</Label>
              <select
                id={`${formId}-edition`}
                className={cn(
                  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs",
                  "outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50",
                )}
                value={editionId}
                onChange={(e) => setEditionId(e.target.value)}
              >
                {journalEditions.map((ed) => (
                  <option key={ed.id} value={ed.id}>
                    {editionLabel(ed)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor={`${formId}-title`}>Título do artigo</Label>
              <Input
                id={`${formId}-title`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título completo do trabalho"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor={`${formId}-file`}>Arquivo do artigo</Label>
              <Input
                id={`${formId}-file`}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="cursor-pointer text-sm file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>

            <div className="border-t border-border/60 pt-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-900">Autores</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={addAuthor}
                >
                  <Plus className="size-3.5" aria-hidden />
                  Adicionar autor
                </Button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Nome, e-mail, instituição e endereço da instituição são obrigatórios.
                {authors.length > 1
                  ? " Marque um autor como contato."
                  : " Com um único autor, ele é o contato."}
              </p>

              <ul className="mt-3 space-y-4">
                {authors.map((a, index) => (
                  <li
                    key={a.id}
                    className="rounded-lg border border-slate-200 bg-slate-50/60 p-3 dark:bg-slate-900/30"
                  >
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Autor {index + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        {authors.length > 1 ? (
                          <label className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-700">
                            <input
                              type="radio"
                              name={`${formId}-contact`}
                              checked={contactAuthorId === a.id}
                              onChange={() => setContactAuthorId(a.id)}
                              className="size-3.5 accent-slate-800"
                            />
                            Contato
                          </label>
                        ) : null}
                        {authors.length > 1 ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => removeAuthor(a.id)}
                            aria-label={`Remover autor ${index + 1}`}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        ) : null}
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="grid gap-1.5 sm:col-span-1">
                        <Label htmlFor={`${formId}-name-${a.id}`}>Nome completo</Label>
                        <Input
                          id={`${formId}-name-${a.id}`}
                          value={a.fullName}
                          onChange={(e) =>
                            updateAuthor(a.id, { fullName: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid gap-1.5 sm:col-span-1">
                        <Label htmlFor={`${formId}-email-${a.id}`}>E-mail</Label>
                        <Input
                          id={`${formId}-email-${a.id}`}
                          type="email"
                          value={a.email}
                          onChange={(e) =>
                            updateAuthor(a.id, { email: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <DialogFooter className="shrink-0 border-t border-border/60 px-4 py-3 sm:justify-end mb-0 mx-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-slate-800 text-slate-50 hover:bg-slate-900">
              Enviar submissão
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
