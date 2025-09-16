import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Lock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePublicSessionEnrollement } from "@/hooks/public/usePublicSessionEnrollment";
import type { PublicSession } from "@/types/public/PublicSession";
import { FeedbackRequestModel, usePostFeedback } from "@/hooks/public/usePublicFeedback";

const MIN_COMMENT = 10;

export default function GiveFeedback() {
  const { toast } = useToast();

  // 1) Access token handling
  const [tokenInput, setTokenInput] = useState("");
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  // 2) Rating & comment
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  // 3) Submission state
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 4) Data fetching via hook (enabled only when we have an accessToken)
  const {
    data: sessionEnrollment,
    isLoading: isLoadingEnrollment,
    isError: isErrorEnrollment,
    error: enrollmentError,
  } = usePublicSessionEnrollement(accessToken, !!accessToken);

  const session: PublicSession | undefined = sessionEnrollment?.session;
  const isTokenValid = !!sessionEnrollment && !isErrorEnrollment;

  // Feedback mutation
  const {
    mutateAsync: postFeedback,
    isLoading: isSubmitting,
    isError: isErrorSubmitting,
    error: submitError,
  } = usePostFeedback();

  // Show toasts on token validation result
  useEffect(() => {
    if (!accessToken) return;
    if (isLoadingEnrollment) return;

    if (isTokenValid) {
      toast({
        title: "Token valide",
        description: "Vous pouvez maintenant donner votre avis sur la session.",
      });
    } else if (isErrorEnrollment) {
      toast({
        title: "Token invalide",
        description: "Le token saisi n'est pas valide. Veuillez vérifier et réessayer.",
        variant: "destructive",
      });
    }
  }, [accessToken, isLoadingEnrollment, isTokenValid, isErrorEnrollment, toast]);

  const handleValidateToken = () => {
    const trimmed = tokenInput.trim();
    if (!trimmed) return;
    setAccessToken(trimmed);
  };

  const resetForm = () => {
    setAccessToken(undefined);
    setTokenInput("");
    setRating(0);
    setHoveredRating(0);
    setComment("");
    setIsSubmitted(false);
  };

  const submitFeedback = async () => {
    if (rating === 0) {
      toast({ title: "Erreur", description: "Veuillez donner une note à la session.", variant: "destructive" });
      return;
    }
    if (comment.trim().length < MIN_COMMENT) {
      toast({ title: "Erreur", description: `Veuillez ajouter un commentaire (au moins ${MIN_COMMENT} caractères).`, variant: "destructive" });
      return;
    }
    if (!accessToken) {
      toast({ title: "Erreur", description: "Token manquant.", variant: "destructive" });
      return;
    }

    const payload: FeedbackRequestModel = {
      accessToken,
      comment: comment.trim(),
      rating,
    };

    try {
      await postFeedback(payload);
      setIsSubmitted(true);
      toast({ title: "Avis envoyé", description: "Merci pour votre retour ! Votre avis a été enregistré." });
    } catch (e) {
      toast({ title: "Envoi impossible", description: submitError?.message || "Une erreur est survenue.", variant: "destructive" });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Merci !</h2>
            <p className="text-gray-600 mb-4">
              Votre avis a été enregistré avec succès. Nous apprécions votre retour sur la formation.
            </p>
            <Button onClick={resetForm} variant="outline">Donner un autre avis</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Évaluation de formation</CardTitle>
          <CardDescription>Donnez votre avis sur la session de formation que vous avez suivie</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {!isTokenValid ? (
            <div className="space-y-4">
              <div className="text-center">
                <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Accès sécurisé</h3>
                <p className="text-gray-600 mb-4">
                  Veuillez saisir le token qui vous a été fourni pour accéder au formulaire d'évaluation.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="token">Token d'accès</Label>
                <Input
                  id="token"
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Saisissez votre token"
                  className="text-center text-lg tracking-wider"
                />
                <p className="text-sm text-gray-500">Le token vous a été fourni par email après la formation.</p>
              </div>

              <Button onClick={handleValidateToken} className="w-full" disabled={tokenInput.trim() === ""}>
                {isLoadingEnrollment && accessToken ? "Vérification..." : "Valider le token"}
              </Button>

              {isErrorEnrollment && accessToken && (
                <p className="text-sm text-red-600">{enrollmentError?.message || "Impossible de valider le token."}</p>
              )}

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Tokens de test :</strong> TOKEN123, ABC456, XYZ789
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Informations de la session */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Informations de la session</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Formation :</span>
                    <span className="font-medium ml-2">{session?.training?.name ?? "—"}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date :</span>
                    <span className="font-medium ml-2">{session?.startDate ?? "—"}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Lieu :</span>
                    <span className="font-medium ml-2">{session?.location ?? "—"}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-600">Formateur :</span>
                    <span className="font-medium ml-2">{(session as any)?.instructor?.name ?? (session as any)?.trainerName ?? "—"}</span>
                  </div>
                </div>
              </div>

              {/* Évaluation */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Comment évaluez-vous cette formation ? *</Label>
                  <div className="flex items-center gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        aria-label={`Donner ${star} étoile${star > 1 ? 's' : ''}`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 transition-colors ${star <= (hoveredRating || rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                        />
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
                    )}
                  </div>
                  {rating > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      {rating === 1 && "Très insatisfaisant"}
                      {rating === 2 && "Insatisfaisant"}
                      {rating === 3 && "Satisfaisant"}
                      {rating === 4 && "Très satisfaisant"}
                      {rating === 5 && "Excellent"}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="comment" className="text-base font-medium">Commentaires et suggestions *</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Partagez votre expérience, ce qui vous a plu, ce qui pourrait être amélioré..."
                    className="mt-2 min-h-[120px]"
                  />
                  <p className="text-sm text-gray-500 mt-1">Minimum {MIN_COMMENT} caractères - {comment.length} caractères saisis</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={submitFeedback} className="flex-1" disabled={isSubmitting || rating === 0 || comment.trim().length < MIN_COMMENT}>
                  {isSubmitting ? "Envoi en cours..." : "Envoyer mon avis"}
                </Button>
                <Button variant="outline" onClick={resetForm}>Annuler</Button>
              </div>

              {isErrorSubmitting && (
                <p className="text-sm text-red-600">{submitError?.message || "Une erreur est survenue lors de l'envoi."}</p>
              )}

              <p className="text-xs text-gray-500 text-center">* Champs obligatoires</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
