
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Eye, 
  Users, 
  Clock, 
  Calendar,
  Plus
} from 'lucide-react';
import { buttonHandlers } from '@/utils/buttonUtils';

export function StructuredDebatesTab() {
  const [createDebateOpen, setCreateDebateOpen] = useState(false);
  const [debateSubject, setDebateSubject] = useState('');
  const [debateDescription, setDebateDescription] = useState('');

  const debates = [
    {
      id: 1,
      title: "Réforme du Code du travail - Article 87",
      description: "Discussion sur les modifications proposées concernant les congés payés",
      participants: 12,
      status: "En cours",
      deadline: "15 Mars 2024",
      category: "Droit social"
    },
    {
      id: 2,
      title: "Nouvelle loi sur l'investissement",
      description: "Analyse des impacts sur les entreprises algériennes",
      participants: 8,
      status: "Planifié",
      deadline: "20 Mars 2024",
      category: "Droit économique"
    }
  ];

  const handleParticipate = (debateTitle: string) => {
    buttonHandlers.generic(`Participer au débat: ${debateTitle}`, 'Rejoindre la discussion', 'Débats')();
  };

  const handleObserve = (debateTitle: string) => {
    buttonHandlers.generic(`Observer le débat: ${debateTitle}`, 'Mode observation', 'Débats')();
  };

  const handleCreateDebate = () => {
    if (debateSubject.trim()) {
      buttonHandlers.startDiscussion(debateSubject)();
      setDebateSubject('');
      setDebateDescription('');
      setCreateDebateOpen(false);
    }
  };

  const handleSaveDraft = () => {
    buttonHandlers.generic('Sauvegarder brouillon', 'Sauvegarde du débat en brouillon', 'Débats')();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Débats Structurés</h2>
        <Button 
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={() => setCreateDebateOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau débat
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {debates.map((debate) => (
          <Card key={debate.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{debate.title}</CardTitle>
                <Badge 
                  variant={debate.status === 'En cours' ? 'default' : 'secondary'}
                  className={debate.status === 'En cours' ? 'bg-green-100 text-green-800' : ''}
                >
                  {debate.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">{debate.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {debate.participants} participants
                </div>
                <Badge variant="outline">{debate.category}</Badge>
              </div>

              <div className="text-sm">
                <span className="text-gray-500">Échéance: </span>
                <span className="font-medium">{debate.deadline}</span>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleParticipate(debate.title)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Participer
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleObserve(debate.title)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Observer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {createDebateOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Lancer un nouveau débat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              placeholder="Sujet du débat..." 
              value={debateSubject}
              onChange={(e) => setDebateSubject(e.target.value)}
            />
            <Textarea 
              placeholder="Description et contexte..." 
              value={debateDescription}
              onChange={(e) => setDebateDescription(e.target.value)}
            />
            <div className="flex gap-2">
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={handleCreateDebate}
                disabled={!debateSubject.trim()}
              >
                Créer le débat
              </Button>
              <Button 
                variant="outline"
                onClick={handleSaveDraft}
              >
                Sauvegarder en brouillon
              </Button>
              <Button 
                variant="ghost"
                onClick={() => setCreateDebateOpen(false)}
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
