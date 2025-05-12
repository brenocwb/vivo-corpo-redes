
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// Church models
interface ChurchLocation {
  name: string;
  address: string;
  city: string;
  type: 'main' | 'house';
}

// Lists of names for generating data
const firstNames = [
  "João", "Maria", "Pedro", "Ana", "José", "Luiza", "Carlos", "Márcia", 
  "Antônio", "Sandra", "Paulo", "Fernanda", "Lucas", "Juliana", "Roberto", "Camila",
  "Marcos", "Patrícia", "Jorge", "Aline", "Ricardo", "Vanessa", "Daniel", "Bruna",
  "Felipe", "Larissa", "Rodrigo", "Beatriz", "Mateus", "Gabriela", "André", "Renata",
  "Guilherme", "Carla", "Rafael", "Luciana", "Gustavo", "Débora", "Marcelo", "Denise",
  "Eduardo", "Natália", "Thiago", "Carolina", "Alexandre", "Jéssica", "Leonardo", "Amanda"
];

const lastNames = [
  "Silva", "Santos", "Oliveira", "Souza", "Pereira", "Costa", "Rodrigues", "Almeida",
  "Nascimento", "Lima", "Araújo", "Fernandes", "Carvalho", "Gomes", "Martins", "Rocha",
  "Ribeiro", "Alves", "Monteiro", "Mendes", "Barros", "Freitas", "Barbosa", "Pinto",
  "Moura", "Cavalcanti", "Dias", "Castro", "Campos", "Cardoso", "Correia", "Cunha",
  "Teixeira", "Ferreira", "Dantas", "Medeiros", "Moreira", "Nunes", "Sales", "Ramos",
  "Vieira", "Sampaio", "Toledo", "Xavier", "Aguiar", "Cruz", "Machado", "Bezerra"
];

const neighborhoods = [
  "Centro", "Jardim América", "Vila Nova", "Santa Luzia", "São José", 
  "Boa Vista", "Santo Antônio", "Vila Maria", "Cidade Nova", "Bela Vista"
];

const cities = [
  "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Brasília", "Salvador",
  "Curitiba", "Fortaleza", "Recife", "Porto Alegre", "Manaus"
];

// Functions to generate data
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const generateRandomName = (): string => {
  return `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`;
};

const generateRandomEmail = (name: string): string => {
  const sanitizedName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/\s+/g, '.');
  const randomNum = Math.floor(Math.random() * 1000);
  const domains = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "corpovivo.com"];
  return `${sanitizedName}${randomNum}@${getRandomItem(domains)}`;
};

const generateChurchLocations = (count: number): ChurchLocation[] => {
  const locations: ChurchLocation[] = [];
  
  // Main church
  locations.push({
    name: "Igreja Corpo Vivo - Sede",
    address: `Av. Principal, ${Math.floor(Math.random() * 1000)}`,
    city: getRandomItem(cities),
    type: 'main'
  });
  
  // House churches
  for (let i = 1; i < count; i++) {
    const neighborhood = getRandomItem(neighborhoods);
    locations.push({
      name: `Corpo Vivo - ${neighborhood}`,
      address: `Rua ${getRandomItem(lastNames)}, ${Math.floor(Math.random() * 1000)}`,
      city: getRandomItem(cities),
      type: 'house'
    });
  }
  
  return locations;
};

// Main function to populate the database
export const generateChurchData = async () => {
  try {
    toast.info("Gerando dados da igreja...");
    
    // 1. Generate church locations
    const churchLocations = generateChurchLocations(10); // 1 main + 9 house churches
    
    // 2. Create users with different roles
    const adminCount = 3;
    const pastorCount = 5;
    const leaderCount = 15;
    const memberCount = 80;
    
    const totalUsers = adminCount + pastorCount + leaderCount + memberCount;
    const users = [];
    
    // Generate admin users
    for (let i = 0; i < adminCount; i++) {
      const name = i === 0 ? "Admin Principal" : `Admin ${i + 1}`;
      const email = i === 0 ? "admin@corpovivo.com" : `admin${i + 1}@corpovivo.com`;
      
      users.push({
        nome: name,
        email: email,
        tipo_usuario: 'admin',
        senha: 'admin123', // Simple password for demo purposes
      });
    }
    
    // Generate pastor users
    for (let i = 0; i < pastorCount; i++) {
      const name = `Pastor ${generateRandomName()}`;
      const email = i === 0 ? "pastor@corpovivo.com" : generateRandomEmail(name);
      
      users.push({
        nome: name,
        email: email,
        tipo_usuario: 'lider', // Pastors are considered leaders in the system
        senha: 'pastor123',
      });
    }
    
    // Generate leader users
    for (let i = 0; i < leaderCount; i++) {
      const name = `Líder ${generateRandomName()}`;
      const email = i === 0 ? "lider@corpovivo.com" : generateRandomEmail(name);
      
      users.push({
        nome: name,
        email: email,
        tipo_usuario: 'lider',
        senha: 'lider123',
      });
    }
    
    // Generate member users
    for (let i = 0; i < memberCount; i++) {
      const name = generateRandomName();
      const email = i === 0 ? "membro@corpovivo.com" : generateRandomEmail(name);
      
      users.push({
        nome: name,
        email: email,
        tipo_usuario: 'membro',
        senha: 'membro123',
      });
    }
    
    // Create users in the database
    const createdUsers = [];
    
    for (const user of users) {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: user.senha,
        options: {
          data: {
            nome: user.nome
          }
        }
      });
      
      if (authError) {
        console.error("Error creating auth user:", authError);
        continue;
      }
      
      if (authData.user) {
        // Then create the user record in the users table
        const { data: userData, error: userError } = await supabase.from('users').insert({
          id: authData.user.id,
          nome: user.nome,
          email: user.email,
          tipo_usuario: user.tipo_usuario
        });
        
        if (userError) {
          console.error("Error creating user record:", userError);
          continue;
        }
        
        createdUsers.push({
          id: authData.user.id,
          ...user
        });
      }
    }
    
    // 3. Create groups (cells)
    const groups = [];
    const leaderAndPastors = createdUsers.filter(u => u.tipo_usuario === 'lider');
    
    for (let i = 0; i < churchLocations.length; i++) {
      const location = churchLocations[i];
      const leaderIndex = i % leaderAndPastors.length;
      
      groups.push({
        nome: location.name,
        descricao: `Grupo de discipulado em ${location.city}`,
        local: location.address,
        dia_semana: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'][i % 7],
        lider_id: leaderAndPastors[leaderIndex].id
      });
    }
    
    // Create groups in the database
    const { data: groupsData, error: groupsError } = await supabase
      .from('grupos')
      .insert(groups);
    
    if (groupsError) {
      console.error("Error creating groups:", groupsError);
      toast.error("Erro ao criar grupos");
    }
    
    // 4. Assign members to groups
    const { data: createdGroups, error: fetchGroupsError } = await supabase
      .from('grupos')
      .select('*');
    
    if (fetchGroupsError || !createdGroups) {
      console.error("Error fetching created groups:", fetchGroupsError);
      toast.error("Erro ao buscar grupos criados");
      return;
    }
    
    // Update users with group assignments
    const members = createdUsers.filter(u => u.tipo_usuario === 'membro');
    const groupAssignments = [];
    
    for (let i = 0; i < members.length; i++) {
      const groupIndex = i % createdGroups.length;
      groupAssignments.push({
        id: members[i].id,
        grupo_id: createdGroups[groupIndex].id
      });
    }
    
    // Update user records with group assignments
    for (const assignment of groupAssignments) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ grupo_id: assignment.grupo_id })
        .eq('id', assignment.id);
      
      if (updateError) {
        console.error("Error updating user with group:", updateError);
      }
    }
    
    // 5. Create discipleship relationships
    const discipulados = [];
    const discipuladores = [...leaderAndPastors];
    
    // Each leader disciples about 5 members
    for (let i = 0; i < discipuladores.length; i++) {
      const startIdx = i * 5;
      const endIdx = Math.min(startIdx + 5, members.length);
      
      for (let j = startIdx; j < endIdx; j++) {
        if (j < members.length) {
          discipulados.push({
            discipulador_id: discipuladores[i].id,
            discipulo_id: members[j].id
          });
        }
      }
    }
    
    // Create discipulados in the database
    const { data: discipuladosData, error: discipuladosError } = await supabase
      .from('discipulados')
      .insert(discipulados);
    
    if (discipuladosError) {
      console.error("Error creating discipulados:", discipuladosError);
      toast.error("Erro ao criar relacionamentos de discipulado");
    }
    
    // 6. Create some encontros for each discipulado
    const { data: createdDiscipulados, error: fetchDiscipuladosError } = await supabase
      .from('discipulados')
      .select('*');
    
    if (fetchDiscipuladosError || !createdDiscipulados) {
      console.error("Error fetching created discipulados:", fetchDiscipuladosError);
      return;
    }
    
    const encontros = [];
    const temas = [
      "Introdução à fé", "Estudo bíblico", "Oração e adoração",
      "Evangelismo", "Comunhão", "Serviço cristão", "Mordomia",
      "Dons espirituais", "Discipulado", "Família cristã"
    ];
    
    for (const discipulado of createdDiscipulados) {
      // Create 1-3 encontros for each discipulado
      const encontroCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < encontroCount; i++) {
        const today = new Date();
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - Math.floor(Math.random() * 60)); // Random date in the past 60 days
        
        encontros.push({
          discipulado_id: discipulado.id,
          data: pastDate.toISOString().split('T')[0],
          tema: getRandomItem(temas),
          anotacoes: `Anotações do encontro sobre ${getRandomItem(temas).toLowerCase()}.`
        });
      }
    }
    
    // Create encontros in the database
    if (encontros.length > 0) {
      const { data: encontrosData, error: encontrosError } = await supabase
        .from('encontros')
        .insert(encontros);
      
      if (encontrosError) {
        console.error("Error creating encontros:", encontrosError);
        toast.error("Erro ao criar encontros");
      }
    }
    
    toast.success(`Dados criados com sucesso! ${totalUsers} usuários, ${churchLocations.length} igrejas, ${discipulados.length} discipulados`, {
      description: "Os dados de teste foram gerados com sucesso!"
    });
    
    // Return login information for testing
    return {
      admin: { email: "admin@corpovivo.com", password: "admin123" },
      pastor: { email: "pastor@corpovivo.com", password: "pastor123" },
      lider: { email: "lider@corpovivo.com", password: "lider123" },
      membro: { email: "membro@corpovivo.com", password: "membro123" }
    };
    
  } catch (error: any) {
    console.error("Error generating church data:", error);
    toast.error("Erro ao gerar dados da igreja", {
      description: error.message
    });
  }
};
