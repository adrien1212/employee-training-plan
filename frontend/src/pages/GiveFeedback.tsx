import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Lock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Session {
  id: number;
  trainingName: string;
  date: string;
  time: string;
  location: string;
  instructor: string;
  description: string;
}

const GiveFeedback = () => {
  const { toast } = useToast();
  const [token, setToken] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mock session data - en réalité, vous récupéreriez cela depuis votre API
  const mockSession: Session = {
    id: 1,
    trainingName: "Sécurité au travail",
    date: "2024-06-15",
    time: "09:00",
    location: "Salle de formation A",
    instructor: "Marie Dubois",
    description: "Formation obligatoire sur les règles de sécurité en entreprise"
  };

  const validateToken = () => {
    // Mock validation - en réalité, vous vérifieriez le token via votre API
    const validTokens = ["TOKEN123", "ABC456", "XYZ789"];
    
    if (validTokens.includes(token.toUpperCase())) {
      setIsTokenValid(true);
      setSession(mockSession);
      toast({
        title: "Token valide",
        description: "Vous pouvez maintenant donner votre avis sur la session.",
      });
    } else {
      toast({
        title: "Token invalide",
        description: "Le token saisi n'est pas valide. Veuillez vérifier et réessayer.",
        variant: "destructive",
      });
    }
  };

  const submitFeedback = () => {
    if (rating === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez donner une note à la session.",
        variant: "destructive",
      });
      return;
    }

    if (comment.trim() === "") {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter un commentaire.",
        variant: "destructive",
      });
      return;
    }

    // Ici vous enverriez les données à votre API
    console.log({
      token,
      sessionId: session?.id,
      rating,
      comment
    });

    setIsSubmitted(true);
    toast({
      title: "Avis envoyé",
      description: "Merci pour votre retour ! Votre avis a été enregistré.",
    });
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
            <Button onClick={() => window.location.reload()} variant="outline">
              Donner un autre avis
            </Button>
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
          <CardDescription>
            Donnez votre avis sur la session de formation que vous avez suivie
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isTokenValid ? (
            <div className="space-y-4">
              <div className="text-center">
                <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Accès sécurisé
                </h3>
                <p className="text-gray-600 mb-4">
                  Veuillez saisir le token qui vous a été fourni pour accéder au formulaire d'évaluation.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="token">Token d'accès</Label>
                <Input
                  id="token"
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Saisissez votre token"
                  className="text-center text-lg tracking-wider"
                />
                <p className="text-sm text-gray-500">
                  Le token vous a été fourni par email après la formation.
                </p>
              </div>

              <Button 
                onClick={validateToken} 
                className="w-full"
                disabled={token.trim() === ""}
              >
                Valider le token
              </Button>

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
                    <span className="font-medium ml-2">{session?.trainingName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date :</span>
                    <span className="font-medium ml-2">{session?.date}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Heure :</span>
                    <span className="font-medium ml-2">{session?.time}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Lieu :</span>
                    <span className="font-medium ml-2">{session?.location}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-600">Formateur :</span>
                    <span className="font-medium ml-2">{session?.instructor}</span>
                  </div>
                </div>
              </div>

              {/* Évaluation */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">
                    Comment évaluez-vous cette formation ? *
                  </Label>
                  <div className="flex items-center gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 transition-colors ${
                            star <= (hoveredRating || rating)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="ml-2 text-sm text-gray-600">
                        ({rating}/5)
                      </span>
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
                  <Label htmlFor="comment" className="text-base font-medium">
                    Commentaires et suggestions *
                  </Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Partagez votre expérience, ce qui vous a plu, ce qui pourrait être amélioré..."
                    className="mt-2 min-h-[120px]"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Minimum 10 caractères - {comment.length} caractères saisis
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={submitFeedback}
                  className="flex-1"
                  disabled={rating === 0 || comment.trim().length < 10}
                >
                  Envoyer mon avis
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsTokenValid(false);
                    setToken("");
                    setRating(0);
                    setComment("");
                  }}
                >
                  Annuler
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                * Champs obligatoires
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GiveFeedback;