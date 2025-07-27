import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TabFormField } from '@/components/common/TabFormField';
import { BookOpen, Languages, FileText, Search } from 'lucide-react';
import { AddLegalTextForm } from '@/components/forms/AddLegalTextForm';
import { useGlobalActions } from '@/hooks/useGlobalActions';

export function DictionariesSection() {
  const [showAddForm, setShowAddForm] = useState(false);
  const actions = useGlobalActions();

  const handleAdd = () => {
    setShowAddForm(true);
  };

  const handleEnrich = () => {
    actions.handleImport(['.pdf', '.doc', '.docx', '.txt']);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
  };

  if (showAddForm) {
    return (
      <AddLegalTextForm 
        isOpen={true} 
        onClose={handleCloseForm} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="francais-arabe" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="francais-arabe" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Dictionnaire Français-Arabe
          </TabsTrigger>
          <TabsTrigger value="terminologie" className="gap-2">
            <Languages className="w-4 h-4" />
            Terminologie Spécialisée
          </TabsTrigger>
        </TabsList>

        <TabsContent value="francais-arabe" className="mt-6 space-y-6">
          {/* Boutons d'action connectés */}
          <div className="flex gap-3 justify-center mb-6">
            <Button className="gap-2" onClick={handleAdd}>
              <BookOpen className="w-4 h-4" />
              Ajouter
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleEnrich}>
              <FileText className="w-4 h-4" />
              Enrichir
            </Button>
          </div>

          {/* Recherche avancée pour dictionnaire */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input placeholder="Rechercher un terme en français..." />
                  <Input placeholder="Rechercher en arabe..." />
                  <select className="p-2 border rounded-md">
                    <option>Tous les domaines</option>
                    <option>Droit civil</option>
                    <option>Droit pénal</option>
                    <option>Droit commercial</option>
                    <option>Droit administratif</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button>
                    <Search className="w-4 h-4 mr-2" />
                    Rechercher dans les 15,000 termes
                  </Button>
                  <Button variant="outline">Filtres avancés</Button>
                  <Button variant="outline">Recherche phonétique</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    Dictionnaire Français-Arabe
                  </CardTitle>
                  <p className="text-sm text-gray-600">15,000 termes juridiques bilingues français-arabe</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Statistiques du dictionnaire */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-purple-50 rounded">
                      <div className="font-bold text-purple-600">15,000</div>
                      <div className="text-xs text-gray-600">Termes</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-bold text-blue-600">12</div>
                      <div className="text-xs text-gray-600">Domaines</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="font-bold text-green-600">2,400</div>
                      <div className="text-xs text-gray-600">Nouveaux/mois</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
                      <div className="font-medium text-sm">Contrat (عقد)</div>
                      <p className="text-xs text-gray-600">Convention par laquelle une ou plusieurs personnes s'obligent...</p>
                      <div className="flex gap-1 mt-1">
                        <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">Droit civil</span>
                        <span className="text-xs bg-green-100 text-green-800 px-1 rounded">Fréquent</span>
                      </div>
                    </div>
                    <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
                      <div className="font-medium text-sm">Tribunal (محكمة)</div>
                      <p className="text-xs text-gray-600">Juridiction chargée de rendre la justice...</p>
                      <div className="flex gap-1 mt-1">
                        <span className="text-xs bg-red-100 text-red-800 px-1 rounded">Droit judiciaire</span>
                        <span className="text-xs bg-green-100 text-green-800 px-1 rounded">Fréquent</span>
                      </div>
                    </div>
                    <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
                      <div className="font-medium text-sm">Jurisprudence (اجتهاد قضائي)</div>
                      <p className="text-xs text-gray-600">Ensemble des décisions rendues par les tribunaux...</p>
                      <div className="flex gap-1 mt-1">
                        <span className="text-xs bg-purple-100 text-purple-800 px-1 rounded">Droit général</span>
                        <span className="text-xs bg-orange-100 text-orange-800 px-1 rounded">Expert</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      Consulter le dictionnaire complet
                    </Button>
                    <Button variant="outline" size="sm">
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Glossaire des Termes Juridiques Courants</CardTitle>
                <p className="text-sm text-gray-600">Définitions des termes les plus utilisés dans le droit algérien</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="font-medium text-sm">Appel (استئناف)</div>
                      <p className="text-xs text-gray-600">Voie de recours ordinaire contre les jugements rendus en première instance</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="font-medium text-sm">Mise en demeure (إنذار)</div>
                      <p className="text-xs text-gray-600">Sommation faite à un débiteur de s'exécuter</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="font-medium text-sm">Nullité (بطلان)</div>
                      <p className="text-xs text-gray-600">Sanction frappant un acte juridique vicié</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="font-medium text-sm">Cassation (نقض)</div>
                      <p className="text-xs text-gray-600">Recours devant la Cour Suprême contre les arrêts des cours d'appel</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="font-medium text-sm">Prescription (تقادم)</div>
                      <p className="text-xs text-gray-600">Extinction d'un droit par l'écoulement du temps</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="font-medium text-sm">Exécution forcée (تنفيذ جبري)</div>
                      <p className="text-xs text-gray-600">Mise en œuvre contrainte d'une décision de justice</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="terminologie" className="mt-6 space-y-6">
          {/* Boutons d'action connectés */}
          <div className="flex gap-3 justify-center mb-6">
            <Button className="gap-2" onClick={handleAdd}>
              <BookOpen className="w-4 h-4" />
              Ajouter
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleEnrich}>
              <FileText className="w-4 h-4" />
              Enrichir
            </Button>
          </div>

          <TabFormField
            placeholder="Rechercher dans la terminologie spécialisée..."
            onSearch={(query) => console.log('Recherche terminologie:', query)}
            showActions={true}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="w-5 h-5 text-green-600" />
                  Terminologie Spécialisée
                </CardTitle>
                <p className="text-sm text-gray-600">Termes juridiques par domaine de droit</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">Droit Civil</span>
                      <span className="text-xs text-blue-600">1250 termes</span>
                    </div>
                  </div>
                  <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">Droit Pénal</span>
                      <span className="text-xs text-red-600">890 termes</span>
                    </div>
                  </div>
                  <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">Droit Commercial</span>
                      <span className="text-xs text-green-600">756 termes</span>
                    </div>
                  </div>
                  <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">Droit Administratif</span>
                      <span className="text-xs text-purple-600">634 termes</span>
                    </div>
                  </div>
                  <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">Droit du Travail</span>
                      <span className="text-xs text-orange-600">567 termes</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Exemples par domaine</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-2 bg-blue-50 rounded">
                      <div className="text-sm font-medium text-blue-700">Droit Civil</div>
                      <div className="text-xs text-blue-600">Mariage, divorce, succession, propriété</div>
                    </div>
                    <div className="p-2 bg-red-50 rounded">
                      <div className="text-sm font-medium text-red-700">Droit Pénal</div>
                      <div className="text-xs text-red-600">Crime, délit, contravention, peine</div>
                    </div>
                    <div className="p-2 bg-green-50 rounded">
                      <div className="text-sm font-medium text-green-700">Droit Commercial</div>
                      <div className="text-xs text-green-600">Société, fonds de commerce, bail commercial</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Recherche avancée</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Par domaine juridique
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Par origine du terme
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Par synonymes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
