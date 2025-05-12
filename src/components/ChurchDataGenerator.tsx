
import { Button } from "@/components/ui/button";
import { Database, UsersRound } from "lucide-react";
import { generateChurchData } from "@/utils/churchDataGenerator";
import { useState } from "react";
import { toast } from "sonner";

export function ChurchDataGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [credentials, setCredentials] = useState<any>(null);

  const handleGenerateData = async () => {
    try {
      setIsGenerating(true);
      const loginInfo = await generateChurchData();
      setCredentials(loginInfo);
      setShowCredentials(true);
    } catch (error) {
      console.error("Error generating data:", error);
      toast.error("Erro ao gerar dados");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-8 border rounded-md p-4 bg-white dark:bg-gray-800">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-600" />
          <h3 className="font-medium">Gerador de Dados de Teste</h3>
        </div>
        
        <p className="text-sm text-gray-500">
          Gere dados de teste para simular uma igreja com 100 membros, incluindo pastores, líderes, 
          discípulos e múltiplas células em casas.
        </p>
        
        {showCredentials && credentials && (
          <div className="mt-2 text-sm border rounded-md p-3 bg-gray-50 dark:bg-gray-700">
            <h4 className="font-semibold mb-2">Credenciais de Acesso:</h4>
            <ul className="space-y-1">
              <li><span className="font-medium">Admin:</span> {credentials.admin.email} / {credentials.admin.password}</li>
              <li><span className="font-medium">Pastor:</span> {credentials.pastor.email} / {credentials.pastor.password}</li>
              <li><span className="font-medium">Líder:</span> {credentials.lider.email} / {credentials.lider.password}</li>
              <li><span className="font-medium">Membro:</span> {credentials.membro.email} / {credentials.membro.password}</li>
            </ul>
          </div>
        )}
        
        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleGenerateData}
          disabled={isGenerating}
        >
          <UsersRound className="h-4 w-4" />
          {isGenerating ? "Gerando dados..." : "Gerar Dados de Igreja"}
        </Button>
      </div>
    </div>
  );
}
