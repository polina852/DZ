import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, 
  FileCheck, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  Eye,
  Download,
  Trash2,
  Edit,
  Plus,
  Search,
  Bell,
  Lock,
  Database
} from "lucide-react";

interface RGPDComplianceTabProps {
  language?: string;
}

export function RGPDComplianceTab({ language = "fr" }: RGPDComplianceTabProps) {
  const [consentSearch, setConsentSearch] = useState("");
  const [rightsRequestSearch, setRightsRequestSearch] = useState("");

  // Scores de conformité
  const complianceScores = [
    { category: "Consentement", score: 85, status: "Bon", color: "text-green-600" },
    { category: "Droits des personnes", score: 92, status: "Excellent", color: "text-green-600" },
    { category: "Sécurité des données", score: 78, status: "Moyen", color: "text-yellow-600" },
    { category: "Notifications", score: 95, status: "Excellent", color: "text-green-600" },
    { category: "Documentation", score: 88, status: "Bon", color: "text-green-600" },
    { category: "Formation", score: 65, status: "Faible", color: "text-red-600" }
  ];

  // Gestion des consentements
  const consents = [
    { 
      id: "1", 
      user: "user@example.com", 
      purpose: "Marketing Email", 
      status: "Accordé", 
      date: "2025-01-15", 
      expiry: "2026-01-15",
      source: "Site Web"
    },
    { 
      id: "2", 
      user: "test@domain.com", 
      purpose: "Cookies Analytics", 
      status: "Refusé", 
      date: "2025-01-10", 
      expiry: "-",
      source: "Cookie Banner"
    },
    { 
      id: "3", 
      user: "admin@company.dz", 
      purpose: "Newsletter", 
      status: "Accordé", 
      date: "2025-01-05", 
      expiry: "2025-07-05",
      source: "Formulaire"
    }
  ].filter(consent => 
    consent.user.toLowerCase().includes(consentSearch.toLowerCase()) ||
    consent.purpose.toLowerCase().includes(consentSearch.toLowerCase())
  );

  // Demandes de droits
  const rightsRequests = [
    { 
      id: "R001", 
      type: "Accès aux données", 
      user: "jean.dupont@email.com", 
      status: "En cours", 
      date: "2025-01-20",
      deadline: "2025-02-20",
      assignee: "DPO Team"
    },
    { 
      id: "R002", 
      type: "Suppression", 
      user: "marie.martin@test.dz", 
      status: "Terminé", 
      date: "2025-01-18",
      deadline: "2025-02-18",
      assignee: "Admin"
    },
    { 
      id: "R003", 
      type: "Rectification", 
      user: "ahmed.benali@gov.dz", 
      status: "Nouveau", 
      date: "2025-01-22",
      deadline: "2025-02-22",
      assignee: "Non assigné"
    }
  ].filter(request => 
    request.user.toLowerCase().includes(rightsRequestSearch.toLowerCase()) ||
    request.type.toLowerCase().includes(rightsRequestSearch.toLowerCase())
  );

  // Violations de données
  const dataBreaches = [
    { 
      id: "B001", 
      severity: "Élevé", 
      description: "Accès non autorisé base de données", 
      date: "2025-01-15",
      status: "Notifié CNIL",
      affectedUsers: 150,
      reportedBy: "Système automatique"
    },
    { 
      id: "B002", 
      severity: "Moyen", 
      description: "Email envoyé en erreur", 
      date: "2025-01-10",
      status: "Résolu",
      affectedUsers: 5,
      reportedBy: "Utilisateur"
    }
  ];

  // Registre des traitements
  const processingActivities = [
    { 
      name: "Gestion RH", 
      purpose: "Administration du personnel", 
      dataTypes: "Nom, Email, Salaire", 
      retention: "5 ans après départ",
      legalBasis: "Contrat de travail",
      lastReview: "2024-12-01"
    },
    { 
      name: "Newsletter", 
      purpose: "Communication marketing", 
      dataTypes: "Email, Préférences", 
      retention: "Jusqu'à désinscription",
      legalBasis: "Consentement",
      lastReview: "2024-11-15"
    },
    { 
      name: "Support Client", 
      purpose: "Assistance utilisateurs", 
      dataTypes: "Email, Historique", 
      retention: "3 ans",
      legalBasis: "Intérêt légitime",
      lastReview: "2024-10-20"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accordé': case 'Terminé': case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Refusé': case 'Élevé': case 'Faible': return 'bg-red-100 text-red-800';
      case 'En cours': case 'Moyen': case 'Bon': return 'bg-yellow-100 text-yellow-800';
      case 'Nouveau': case 'Notifié CNIL': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {complianceScores.map((item, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">{item.category}</h4>
                </div>
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Score de conformité</span>
                  <span className={`font-medium ${item.color}`}>{item.score}%</span>
                </div>
                <Progress value={item.score} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="consent" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="consent">Consentements</TabsTrigger>
          <TabsTrigger value="rights">Droits</TabsTrigger>
          <TabsTrigger value="breaches">Violations</TabsTrigger>
          <TabsTrigger value="registry">Registre</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="consent" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Gestion des Consentements</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-10 w-64"
                  value={consentSearch}
                  onChange={(e) => setConsentSearch(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {consents.map((consent) => (
              <Card key={consent.id}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Users className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="font-semibold text-gray-900">{consent.user}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span><strong>Finalité:</strong> {consent.purpose}</span>
                          <span><strong>Source:</strong> {consent.source}</span>
                          <span><strong>Expiration:</strong> {consent.expiry}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-500">Accordé le {consent.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(consent.status)} style={{ marginBottom: '8px' }}>
                        {consent.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rights" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Demandes de Droits des Personnes</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-10 w-64"
                  value={rightsRequestSearch}
                  onChange={(e) => setRightsRequestSearch(e.target.value)}
                />
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle demande
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {rightsRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <FileCheck className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">#{request.id}</h4>
                          <Badge variant="outline">{request.type}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span><strong>Utilisateur:</strong> {request.user}</span>
                          <span><strong>Assigné à:</strong> {request.assignee}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span>Créé le {request.date}</span>
                          <span>Échéance: {request.deadline}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(request.status)} style={{ marginBottom: '8px' }}>
                        {request.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="breaches" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Violations de Données</h3>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Signaler une violation
            </Button>
          </div>

          <div className="space-y-3">
            {dataBreaches.map((breach) => (
              <Card key={breach.id}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <AlertTriangle className={`w-6 h-6 ${
                        breach.severity === 'Critique' ? 'text-red-600' :
                        breach.severity === 'Élevé' ? 'text-orange-600' :
                        'text-yellow-600'
                      }`} />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">#{breach.id}</h4>
                          <Badge className={getStatusColor(breach.severity)}>
                            {breach.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-1">{breach.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span><strong>Utilisateurs affectés:</strong> {breach.affectedUsers}</span>
                          <span><strong>Rapporté par:</strong> {breach.reportedBy}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-500">{breach.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(breach.status)} style={{ marginBottom: '8px' }}>
                        {breach.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Bell className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="registry" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Registre des Activités de Traitement</h3>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle activité
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {processingActivities.map((activity, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-purple-600" />
                    {activity.name}
                  </CardTitle>
                  <CardDescription>{activity.purpose}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Types de données:</span>
                    <p className="text-sm text-gray-600">{activity.dataTypes}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Durée de conservation:</span>
                    <p className="text-sm text-gray-600">{activity.retention}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Base légale:</span>
                    <p className="text-sm text-gray-600">{activity.legalBasis}</p>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-gray-500">Dernière révision: {activity.lastReview}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <h3 className="text-lg font-semibold">Rapports de Conformité</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-green-600" />
                  Rapport Mensuel RGPD
                </CardTitle>
                <CardDescription>Conformité générale - Janvier 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Score global</span>
                    <span className="font-bold text-green-600">86%</span>
                  </div>
                  <Progress value={86} className="h-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Dernière génération: 22/01/2025</span>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  Audit Loi 18-07
                </CardTitle>
                <CardDescription>Conformité Algérienne - Q4 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Score de conformité</span>
                    <span className="font-bold text-blue-600">91%</span>
                  </div>
                  <Progress value={91} className="h-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Dernière génération: 15/01/2025</span>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Actions Correctives Recommandées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Formation RGPD insuffisante</h4>
                    <p className="text-sm text-gray-600">65% du personnel nécessite une formation mise à jour</p>
                    <Badge className="bg-orange-100 text-orange-800 mt-1">Priorité Moyenne</Badge>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Procédures de sécurité à renforcer</h4>
                    <p className="text-sm text-gray-600">Score de sécurité technique en dessous de 80%</p>
                    <Badge className="bg-red-100 text-red-800 mt-1">Priorité Élevée</Badge>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Documentation à jour</h4>
                    <p className="text-sm text-gray-600">Registre des traitements conforme</p>
                    <Badge className="bg-green-100 text-green-800 mt-1">Conforme</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}