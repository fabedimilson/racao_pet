'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dog, 
  Cat, 
  FileText, 
  Megaphone, 
  CheckCircle, 
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Menu, 
  X, 
  Heart, 
  Info,
  Download,
  Calendar,
  MapPin,
  BarChart3,
  UploadCloud,
  Camera,
  AlertCircle,
  Search,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import { submitRegistration, consultProcess } from './actions';

interface Pet {
  nome: string;
  idade: string;
  fotoVacina: File | null;
  fotoPet: File | null;
}

interface FormData {
  nome: string;
  cpf: string;
  email: string;
  rendimento: string;
  cep: string;
  bairro: string;
  morada: string;
  numero: string;
  caes: number;
  gatos: number;
  pets_caes: Pet[];
  pets_gatos: Pet[];
  aceitaTermos: boolean;
}

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);

  // Estados da Consulta
  const [showConsulta, setShowConsulta] = useState(false);
  const [consultaData, setConsultaData] = useState('');
  const [resultadoConsulta, setResultadoConsulta] = useState<any>(null);
  const [isConsulting, setIsConsulting] = useState(false);

  const handleConsulta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (consultaData.trim().length >= 11) {
      setIsConsulting(true);
      const res = await consultProcess(consultaData);
      setIsConsulting(false);
      
      if (res.success) {
        setResultadoConsulta(res.data);
      } else {
        alert(res.error);
      }
    } else {
      alert("Por favor, insira um CPF ou Protocolo válido.");
    }
  };

  const closeConsulta = () => {
    setShowConsulta(false);
    setConsultaData('');
    setResultadoConsulta(null);
  };

  // Estados do Formulário
  const [showForm, setShowForm] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    nome: '', 
    cpf: '', 
    email: '', 
    rendimento: '',
    cep: '', 
    bairro: '', 
    morada: '', 
    numero: '',
    caes: 0, 
    gatos: 0,
    pets_caes: [], 
    pets_gatos: [],
    aceitaTermos: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedProtocolo, setGeneratedProtocolo] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormStep(1);
    setIsSubmitted(false);
    setFormData({
      nome: '', 
      cpf: '', 
      email: '',
      rendimento: '',
      cep: '', 
      bairro: '', 
      morada: '', 
      numero: '',
      caes: 0, 
      gatos: 0,
      pets_caes: [], 
      pets_gatos: [],
      aceitaTermos: false
    });
    setShowForm(false);
  };

  const updatePetCount = (tipo: 'caes' | 'gatos', operacao: '+' | '-') => {
    setFormData(prev => {
      const currentCount = prev[tipo];
      const newCount = operacao === '+' ? currentCount + 1 : Math.max(0, currentCount - 1);
      const petArrayKey = tipo === 'caes' ? 'pets_caes' : 'pets_gatos';
      const newPetsArr = [...prev[petArrayKey]];

      if (newCount > currentCount) {
         newPetsArr.push({ nome: '', idade: '', fotoVacina: null, fotoPet: null });
      } else if (newCount < currentCount) {
         newPetsArr.pop();
      }

      return {
        ...prev,
        [tipo]: newCount,
        [petArrayKey]: newPetsArr
      };
    });
  };

  const handlePetDetailChange = (tipo: 'caes' | 'gatos', index: number, field: keyof Pet, value: any) => {
    setFormData(prev => {
       const petArrayKey = tipo === 'caes' ? 'pets_caes' : 'pets_gatos';
       const newPetsArr = [...prev[petArrayKey]];
       newPetsArr[index] = { ...newPetsArr[index], [field]: value };
       return { ...prev, [petArrayKey]: newPetsArr };
    });
  };

  const banners = [
    {
      url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      alt: "Cachorro feliz"
    },
    {
      url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      alt: "Gato adorável"
    }
  ];

  // Efeito para alternar os banners a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // Efeito para mudar o estilo do header ao rolar a página
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden text-slate-800">
      {/* Estilos customizados para animações e formas */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        @keyframes float-delayed {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 5s ease-in-out infinite 2s; }
        .animate-pulse-soft { animation: pulse-soft 3s ease-in-out infinite; }
        
        .blob-shape {
          border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
        }
      `}} />

      {/* HEADER / NAVBAR */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          {/* Logo Prefeitura de Manaus */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bras%C3%A3o_de_Manaus.svg/100px-Bras%C3%A3o_de_Manaus.svg.png" 
              alt="Brasão de Manaus" 
              className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col justify-center">
              <span className="text-base md:text-xl font-black text-blue-900 leading-none tracking-tight">PREFEITURA DE</span>
              <span className="text-base md:text-xl font-black text-green-700 leading-none tracking-tight">MANAUS</span>
            </div>
            <div className="w-px h-8 bg-slate-300 mx-1 md:mx-3 hidden sm:block"></div>
            <div className="hidden sm:flex flex-col justify-center">
               <span className="text-xs md:text-sm font-bold text-blue-900 flex items-center gap-1">
                 <Dog size={14} className="text-green-600" /> Ração do
               </span>
               <span className="text-xs md:text-sm font-bold text-green-600 leading-none">Meu Pet</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-medium text-slate-600">
            <a href="#como-funciona" className="hover:text-blue-800 transition-colors">Como Funciona</a>
            <a href="#estatisticas" className="hover:text-blue-800 transition-colors">Estatísticas</a>
            <a href="#editais" className="hover:text-blue-800 transition-colors">Editais e Resultados</a>
            <button onClick={() => setShowConsulta(true)} className="text-blue-900 border border-blue-900 hover:bg-blue-50 px-5 py-2 rounded-full font-semibold transition-all flex items-center gap-2">
              <Search size={16} /> Consultar
            </button>
            <button onClick={() => setShowForm(true)} className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2">
              Fazer Inscrição <ArrowRight size={18} />
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-blue-900 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 p-4 flex flex-col gap-4">
            <a href="#como-funciona" onClick={() => setMobileMenuOpen(false)} className="block p-2 text-slate-600 font-medium">Como Funciona</a>
            <a href="#estatisticas" onClick={() => setMobileMenuOpen(false)} className="block p-2 text-slate-600 font-medium">Estatísticas</a>
            <a href="#editais" onClick={() => setMobileMenuOpen(false)} className="block p-2 text-slate-600 font-medium">Editais e Resultados</a>
            <button onClick={() => { setShowConsulta(true); setMobileMenuOpen(false); }} className="border border-blue-900 text-blue-900 p-3 rounded-lg font-semibold w-full flex justify-center items-center gap-2">
              <Search size={18} /> Consultar Processo
            </button>
            <button onClick={() => { setShowForm(true); setMobileMenuOpen(false); }} className="bg-blue-900 text-white p-3 rounded-lg font-semibold w-full flex justify-center items-center gap-2">
              Fazer Inscrição Agora
            </button>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-slate-50">
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-blue-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-green-100 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            
            {/* Texto Hero */}
            <div className="flex-1 space-y-8 text-center md:text-left z-10">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-2 border border-green-200">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Edital 2026 Aberto!
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-900 leading-tight">
                Alimentando o <span className="text-green-600 relative">
                  amor
                  <Heart className="absolute -top-6 -right-6 text-yellow-500 opacity-80 animate-pulse-soft" size={32} />
                </span> que você tem pelo seu pet.
              </h2>
              
              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto md:mx-0">
                O programa da Prefeitura de Manaus que garante ração gratuita para cães e gatos de famílias de baixa renda e protetores de animais. Garanta a nutrição de quem te dá tanta alegria!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-600/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 text-center">
                  <FileText size={20} />
                  Inscrever meu Pet
                </button>
                <a href="#editais" className="bg-white hover:bg-slate-50 text-blue-900 border border-blue-200 px-8 py-4 rounded-xl font-bold text-lg shadow-sm transition-all flex items-center justify-center gap-2 text-center">
                  Ver Editais
                </a>
              </div>
              
              <div className="pt-4 flex items-center justify-center md:justify-start gap-4 text-sm text-slate-500 font-medium">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden z-[${5-i}]`}>
                      <Dog size={16} className="text-slate-400" />
                    </div>
                  ))}
                </div>
                <p>Mais de <strong className="text-blue-900">1.000 famílias</strong> já beneficiadas.</p>
              </div>
            </div>

            {/* Imagem/Ilustração Hero */}
            <div className="flex-1 relative w-full max-w-lg mx-auto md:max-w-none">
              <div className="relative w-full aspect-square blob-shape bg-blue-100 p-8 flex items-center justify-center">
                {/* Elementos flutuantes simulando pets/ração */}
                <div className="absolute top-10 right-10 bg-white p-4 rounded-2xl shadow-xl animate-float-delayed rotate-6 border border-slate-100">
                  <Cat size={48} className="text-yellow-500" strokeWidth={1.5} />
                </div>
                <div className="absolute bottom-20 left-4 bg-white p-5 rounded-2xl shadow-xl animate-float -rotate-6 border border-slate-100">
                  <Dog size={56} className="text-blue-800" strokeWidth={1.5} />
                </div>
                
                {/* Card de Informação sobreposto */}
                <div className="absolute -bottom-6 right-0 md:-right-10 bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-4 animate-float-delayed z-20">
                  <div className="bg-green-100 text-green-700 p-3 rounded-full">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase">Distribuição</p>
                    <p className="font-extrabold text-blue-900">Até 30kg / mês</p>
                  </div>
                </div>

                {/* Imagens centrais com transição (Cachorro / Gato) */}
                <div className="relative w-3/4 h-3/4 z-10">
                  {banners.map((banner, index) => (
                    <img 
                      key={index}
                      src={banner.url} 
                      alt={banner.alt} 
                      className={`absolute inset-0 w-full h-full rounded-full object-cover shadow-2xl border-8 border-white transition-opacity duration-1000 ease-in-out ${index === currentBanner ? 'opacity-100' : 'opacity-0'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-green-600 font-bold tracking-wider uppercase text-sm mb-2">Passo a Passo</h3>
            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900">Como participar do programa?</h2>
            <p className="text-slate-600 mt-4 text-lg">O processo é simples, transparente e feito para garantir que a ajuda chegue a quem mais precisa.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Linha conectora (visível apenas em desktop) */}
            <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-blue-100 -z-10"></div>

            {/* Passos */}
            {[
              {
                icon: <Info size={32} />,
                title: "1. Verifique a Renda",
                desc: "Destinado a tutores com renda familiar de até um salário mínimo por pessoa."
              },
              {
                icon: <FileText size={32} />,
                title: "2. Faça a Inscrição",
                desc: "Preencha o formulário online com seus dados e do seu pet quando o edital abrir."
              },
              {
                icon: <CheckCircle size={32} />,
                title: "3. Aguarde a Análise",
                desc: "A Semmas avaliará as informações. Acompanhe a lista de aprovados nos Resultados."
              },
              {
                icon: <Dog size={32} />,
                title: "4. Retire a Ração",
                desc: "Compareça ao ponto de entrega no dia e horário agendados com seu cupom."
              }
            ].map((step, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group">
                <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center text-blue-800 shadow-md mb-6 group-hover:scale-110 group-hover:bg-blue-800 group-hover:text-white transition-all duration-300">
                  {step.icon}
                </div>
                <h4 className="text-xl font-bold text-blue-900 mb-3">{step.title}</h4>
                <p className="text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ESTATÍSTICAS E IMPACTO */}
      <section id="estatisticas" className="py-20 bg-blue-900 relative overflow-hidden">
        {/* Background decorators */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-900 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-yellow-500 font-bold tracking-wider uppercase text-sm mb-2">Transparência</h3>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Impacto do Programa</h2>
            <p className="text-blue-200 mt-4 text-lg">Acompanhe em tempo real os números do programa nas zonas de Manaus.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Cachorros */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 mx-auto bg-green-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-green-500/30">
                <Dog size={28} />
              </div>
              <h4 className="text-4xl font-black text-white mb-1">4.520</h4>
              <p className="text-blue-200 font-medium">Cachorros Inscritos</p>
            </div>

            {/* Card 2: Gatos */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 mx-auto bg-yellow-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-yellow-500/30">
                <Cat size={28} />
              </div>
              <h4 className="text-4xl font-black text-white mb-1">3.180</h4>
              <p className="text-blue-200 font-medium">Gatos Inscritos</p>
            </div>

            {/* Card 3: Bairros */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 mx-auto bg-blue-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/30">
                <MapPin size={28} />
              </div>
              <h4 className="text-4xl font-black text-white mb-1">63</h4>
              <p className="text-blue-200 font-medium">Bairros Atendidos</p>
            </div>

            {/* Card 4: Média */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 mx-auto bg-teal-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-teal-500/30">
                <BarChart3 size={28} />
              </div>
              <h4 className="text-4xl font-black text-white mb-1">2.8</h4>
              <p className="text-blue-200 font-medium">Média de Pets / Tutor</p>
            </div>
          </div>
          
          {/* Barra Visual de Proporção */}
          <div className="mt-12 max-w-3xl mx-auto bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-sm">
            <div className="flex justify-between text-white text-sm font-bold mb-3">
              <span className="flex items-center gap-2"><Dog size={18} className="text-green-400"/> 58% Cachorros</span>
              <span className="flex items-center gap-2">42% Gatos <Cat size={18} className="text-yellow-400"/></span>
            </div>
            <div className="h-4 w-full bg-blue-950/50 rounded-full overflow-hidden flex shadow-inner">
              <div className="h-full bg-green-500 transition-all duration-1000 ease-out" style={{width: '58%'}}></div>
              <div className="h-full bg-yellow-500 transition-all duration-1000 ease-out" style={{width: '42%'}}></div>
            </div>
          </div>
        </div>
      </section>

      {/* EDITAIS E RESULTADOS (QUADRO DE AVISOS) */}
      <section id="editais" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h3 className="text-yellow-600 font-bold tracking-wider uppercase text-sm mb-2 flex items-center gap-2">
                <Megaphone size={16} /> Quadro Oficial
              </h3>
              <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900">Editais e Resultados</h2>
              <p className="text-slate-600 mt-4 text-lg">Acompanhe as publicações oficiais, convocações e listas de beneficiários aprovados.</p>
            </div>
            <button className="text-blue-800 font-semibold hover:text-blue-900 flex items-center gap-1 group">
              Ver histórico completo <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coluna Editais */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-blue-800 p-4">
                <h4 className="text-white font-bold text-xl flex items-center gap-2">
                  <FileText size={24} /> Editais Abertos e Regras
                </h4>
              </div>
              <div className="p-6 space-y-4">
                {/* Item Edital */}
                <div className="p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors flex gap-4 items-start">
                  <div className="bg-green-100 text-green-700 p-3 rounded-lg flex flex-col items-center justify-center min-w-[70px]">
                    <span className="text-sm font-bold uppercase">JAN</span>
                    <span className="text-2xl font-black leading-none">15</span>
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded mb-2">Inscrições Abertas</span>
                    <h5 className="font-bold text-blue-900 text-lg mb-1">Edital 001/2026 - Chamada Pública</h5>
                    <p className="text-sm text-slate-500 mb-3">Abertura de 1.000 novas vagas para tutores de cães e gatos em Manaus.</p>
                    <div className="flex flex-wrap gap-3">
                      <button className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-1.5 px-3 rounded flex items-center gap-1 transition-colors">
                        <Download size={14} /> Baixar PDF
                      </button>
                      <button className="text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 px-3 rounded transition-colors" onClick={() => setShowForm(true)}>
                        Fazer Inscrição
                      </button>
                    </div>
                  </div>
                </div>

                {/* Item Edital Anterior */}
                <div className="p-4 rounded-xl border border-slate-100 flex gap-4 items-start opacity-70">
                  <div className="bg-slate-100 text-slate-500 p-3 rounded-lg flex flex-col items-center justify-center min-w-[70px]">
                    <span className="text-sm font-bold uppercase">NOV</span>
                    <span className="text-2xl font-black leading-none">10</span>
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-2 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded mb-2">Encerrado</span>
                    <h5 className="font-bold text-blue-900 text-lg mb-1">Edital 002/2025 - Recadastramento</h5>
                    <p className="text-sm text-slate-500 mb-3">Período de recadastramento para beneficiários do ano de 2025.</p>
                    <button className="text-sm text-blue-700 font-semibold hover:underline flex items-center gap-1 border-none bg-transparent">
                      <Download size={14} /> Baixar PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna Resultados */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-blue-900 p-4">
                <h4 className="text-white font-bold text-xl flex items-center gap-2">
                  <CheckCircle size={24} /> Resultados e Convocações
                </h4>
              </div>
              <div className="p-6 space-y-4">
                {/* Item Resultado */}
                <div className="p-4 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors flex gap-4 items-start">
                  <div className="mt-1 text-green-600">
                    <Calendar size={28} />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-slate-400 font-semibold mb-1 block">Publicado em 10 de Fev, 2026</span>
                    <h5 className="font-bold text-blue-900 text-lg mb-1">Lista Preliminar de Aprovados (Edital 001/2026)</h5>
                    <p className="text-sm text-slate-500 mb-3">Confira se o seu nome está na lista preliminar. Prazo para recursos até 15/02.</p>
                    <button className="text-sm bg-blue-50 text-blue-800 hover:bg-blue-100 font-semibold py-1.5 px-3 rounded flex items-center gap-1 transition-colors border-none">
                      <FileText size={14} /> Acessar Lista
                    </button>
                  </div>
                </div>

                {/* Item Convocação */}
                <div className="p-4 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors flex gap-4 items-start">
                  <div className="mt-1 text-yellow-500">
                    <Megaphone size={28} />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-slate-400 font-semibold mb-1 block">Publicado em 05 de Fev, 2026</span>
                    <h5 className="font-bold text-blue-900 text-lg mb-1">Cronograma de Entrega - Fevereiro</h5>
                    <p className="text-sm text-slate-500 mb-3">Locais e horários para a retirada da ração neste mês. Leve seu documento com foto.</p>
                    <button className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-1.5 px-3 rounded flex items-center gap-1 transition-colors border-none">
                      <Download size={14} /> Cronograma.pdf
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-blue-900 relative overflow-hidden">
        {/* Decorative Paws */}
        <div className="absolute top-10 left-10 text-blue-800 opacity-50 rotate-[-20deg]">
          <Dog size={120} />
        </div>
        <div className="absolute bottom-10 right-10 text-blue-800 opacity-50 rotate-[20deg]">
          <Cat size={100} />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Pronto para garantir o benefício do seu pet?</h2>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Mantenha seus dados atualizados e não perca os prazos dos editais. A alimentação do seu melhor amigo é nossa prioridade.
          </p>
          <button onClick={() => setShowForm(true)} className="bg-green-500 text-white hover:bg-green-600 px-10 py-4 rounded-full font-bold text-xl shadow-xl transition-all duration-300 hover:scale-105">
            Acessar Sistema de Inscrição
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t-4 border-green-600">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bras%C3%A3o_de_Manaus.svg/100px-Bras%C3%A3o_de_Manaus.svg.png" 
                  alt="Brasão de Manaus" 
                  className="w-10 h-10 grayscale brightness-200 opacity-90" 
                />
                <div>
                  <h1 className="text-lg font-bold text-white leading-none">Prefeitura de Manaus</h1>
                  <p className="text-green-500 text-sm font-semibold">Ração do Meu Pet</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm max-w-sm mb-4">
                Programa oficial da Prefeitura de Manaus, executado pela SEMMAS, com foco no bem-estar animal e apoio social a famílias de baixa renda.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Links Úteis</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-green-500 transition-colors">Início</a></li>
                <li><a href="#como-funciona" className="hover:text-green-500 transition-colors">Como Funciona</a></li>
                <li><a href="#editais" className="hover:text-green-500 transition-colors">Editais e Resultados</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Portal da Prefeitura</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Atendimento</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Segunda a Sexta, 08h às 17h</li>
                <li><a href="mailto:contato.semmas@manaus.am.gov.br" className="hover:text-white transition-colors">contato.semmas@manaus.am.gov.br</a></li>
                <li>Disque Denúncia / Maus tratos: 153</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} Prefeitura de Manaus. Todos os direitos reservados.</p>
            <p>Desenvolvido para garantir o bem-estar animal na nossa cidade.</p>
          </div>
        </div>
      </footer>

      {/* MODAL DO FORMULÁRIO DE INSCRIÇÃO */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-sm" onClick={() => !isSubmitted && setShowForm(false)}></div>
          
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl flex flex-col animate-float" style={{ animation: 'none', transform: 'translateY(0)' }}>
            {/* Header Modal */}
            <div className="sticky top-0 bg-white z-20 px-6 py-4 border-b border-slate-100 flex justify-between items-center rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 text-green-700 p-2 rounded-lg">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-blue-900 text-lg">Inscrição no Programa</h3>
                  {!isSubmitted && <p className="text-xs text-slate-500 font-medium">Passo {formStep} de 4</p>}
                </div>
              </div>
              <button onClick={() => !isSubmitted && setShowForm(false)} className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Corpo Modal */}
            <div className="p-6 md:p-8">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-blue-900 mb-2">Inscrição Recebida!</h3>
                  <p className="text-slate-600 mb-6">Os seus dados foram enviados para a SEMMAS. Acompanhe a lista de resultados na secção de Editais.</p>
                  <div className="bg-slate-50 p-4 rounded-xl text-left border border-slate-200 mb-8 inline-block w-full max-w-sm">
                    <p className="text-sm text-slate-500 mb-1">Nº de Protocolo:</p>
                    <p className="font-mono text-lg font-bold text-blue-800">{generatedProtocolo}</p>
                  </div>
                  <button onClick={resetForm} className="bg-blue-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors w-full border-none">
                    Concluir e Fechar
                  </button>
                </div>
              ) : (
                <form onSubmit={async (e) => { 
                  e.preventDefault(); 
                  if(formStep === 4) {
                    setIsSubmitting(true);
                    const res = await submitRegistration(formData);
                    setIsSubmitting(false);
                    if (res.success) {
                      setGeneratedProtocolo(res.protocolo || '');
                      setIsSubmitted(true);
                    } else {
                      alert("Erro: " + res.error);
                    }
                  } else {
                    setFormStep(prev => prev + 1); 
                  }
                }}>
                  {/* STEP 1: Dados Pessoais */}
                  {formStep === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                      <h4 className="font-bold text-slate-800 text-lg mb-4">1. Dados do Tutor</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                        <input type="text" name="nome" required value={formData.nome} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Ex: Maria da Silva" />
                      </div>

                      {/* NOVO CAMPO EMAIL */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                        <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="exemplo@email.com" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">CPF</label>
                          <input type="text" name="cpf" required value={formData.cpf} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="000.000.000-00" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Rendimento Familiar Mensal</label>
                          <select name="rendimento" required value={formData.rendimento} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                            <option value="">Selecione...</option>
                            <option value="ate_1_sm">Até 1 Salário Mínimo</option>
                            <option value="1_a_2_sm">De 1 a 2 Salários Mínimos</option>
                            <option value="acima_2_sm">Acima de 2 Salários Mínimos</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Morada */}
                  {formStep === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                      <h4 className="font-bold text-slate-800 text-lg mb-4">2. Dados de Morada</h4>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <label className="block text-sm font-medium text-slate-700 mb-1">CEP</label>
                          <input type="text" name="cep" required value={formData.cep} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="69000-000" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-1">Bairro</label>
                          <input type="text" name="bairro" required value={formData.bairro} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Compensa" />
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-3">
                          <label className="block text-sm font-medium text-slate-700 mb-1">Rua / Avenida</label>
                          <input type="text" name="morada" required value={formData.morada} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nome da rua" />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-sm font-medium text-slate-700 mb-1">Número</label>
                          <input type="text" name="numero" required value={formData.numero} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nº" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Quantidade de Pets */}
                  {formStep === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                      <h4 className="font-bold text-slate-800 text-lg mb-2">3. Quantidade de Pets</h4>
                      
                      <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 flex gap-3 mb-4">
                        <AlertCircle size={24} className="flex-shrink-0" />
                        <p className="text-sm">O programa exige um <strong>mínimo de 3 pets</strong> (cães e/ou gatos somados) por tutor. Indique a quantidade exata abaixo.</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-50 rounded-xl p-4 border border-green-100 flex flex-col items-center">
                          <Dog size={32} className="text-green-600 mb-2" />
                          <label className="block text-sm font-bold text-green-900 mb-2 text-center">Quantos cães?</label>
                          <div className="flex items-center gap-3">
                            <button type="button" onClick={() => updatePetCount('caes', '-')} className="w-8 h-8 rounded-full bg-white border border-green-200 text-green-600 font-bold hover:bg-green-100 shadow-sm transition-colors">-</button>
                            <span className="text-xl font-black text-slate-800 w-6 text-center">{formData.caes}</span>
                            <button type="button" onClick={() => updatePetCount('caes', '+')} className="w-8 h-8 rounded-full bg-white border border-green-200 text-green-600 font-bold hover:bg-green-100 shadow-sm transition-colors">+</button>
                          </div>
                        </div>

                        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100 flex flex-col items-center">
                          <Cat size={32} className="text-yellow-600 mb-2" />
                          <label className="block text-sm font-bold text-yellow-900 mb-2 text-center">Quantos gatos?</label>
                          <div className="flex items-center gap-3">
                            <button type="button" onClick={() => updatePetCount('gatos', '-')} className="w-8 h-8 rounded-full bg-white border border-yellow-200 text-yellow-600 font-bold hover:bg-yellow-100 shadow-sm transition-colors">-</button>
                            <span className="text-xl font-black text-slate-800 w-6 text-center">{formData.gatos}</span>
                            <button type="button" onClick={() => updatePetCount('gatos', '+')} className="w-8 h-8 rounded-full bg-white border border-yellow-200 text-yellow-600 font-bold hover:bg-yellow-100 shadow-sm transition-colors">+</button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center py-2">
                        <span className={`text-sm font-bold ${(formData.caes + formData.gatos) < 3 ? 'text-red-500' : 'text-green-600'}`}>
                          Total selecionado: {formData.caes + formData.gatos} pet(s)
                        </span>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Detalhes dos Pets e Termos */}
                  {formStep === 4 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                      <h4 className="font-bold text-slate-800 text-lg mb-2">4. Identificação dos Pets</h4>
                      <p className="text-sm text-slate-600 mb-4">Por favor, insira o nome, idade aproximada e as fotos obrigatórias de cada animal.</p>

                      <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-4 pb-4">
                        {/* Loop Cães */}
                        {formData.pets_caes.map((pet: Pet, index: number) => (
                          <div key={`cao-${index}`} className="bg-white border-2 border-green-100 rounded-xl p-4 shadow-sm relative">
                            <h5 className="font-bold text-green-700 flex items-center gap-2 mb-3"><Dog size={18}/> Cachorro {index + 1}</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                              <input type="text" required value={pet.nome} onChange={(e) => handlePetDetailChange('caes', index, 'nome', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-green-500 outline-none text-sm" placeholder="Nome do cachorro" />
                              <input type="text" required value={pet.idade} onChange={(e) => handlePetDetailChange('caes', index, 'idade', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-green-500 outline-none text-sm" placeholder="Idade aprox. (ex: 2 anos)" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <label className="flex items-center gap-2 bg-slate-50 border border-dashed border-slate-300 rounded-lg p-2 cursor-pointer hover:bg-slate-100 transition-colors">
                                <Camera size={16} className="text-slate-500 flex-shrink-0" />
                                <span className="text-xs text-slate-600 truncate">{pet.fotoPet ? pet.fotoPet.name : "Foto do Pet (Obrigatório)"}</span>
                                <input type="file" required={!pet.fotoPet} accept="image/*" className="hidden" onChange={(e) => {
                                  if (e.target.files?.[0]) handlePetDetailChange('caes', index, 'fotoPet', e.target.files[0]);
                                }} />
                              </label>
                              <label className="flex items-center gap-2 bg-slate-50 border border-dashed border-slate-300 rounded-lg p-2 cursor-pointer hover:bg-slate-100 transition-colors">
                                <UploadCloud size={16} className="text-slate-500 flex-shrink-0" />
                                <span className="text-xs text-slate-600 truncate">{pet.fotoVacina ? pet.fotoVacina.name : "Cartão de Vacina (Obrigatório)"}</span>
                                <input type="file" required={!pet.fotoVacina} accept="image/*,.pdf" className="hidden" onChange={(e) => {
                                  if (e.target.files?.[0]) handlePetDetailChange('caes', index, 'fotoVacina', e.target.files[0]);
                                }} />
                              </label>
                            </div>
                          </div>
                        ))}

                        {/* Loop Gatos */}
                        {formData.pets_gatos.map((pet: Pet, index: number) => (
                          <div key={`gato-${index}`} className="bg-white border-2 border-yellow-100 rounded-xl p-4 shadow-sm relative">
                            <h5 className="font-bold text-yellow-700 flex items-center gap-2 mb-3"><Cat size={18}/> Gato {index + 1}</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                              <input type="text" required value={pet.nome} onChange={(e) => handlePetDetailChange('gatos', index, 'nome', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none text-sm" placeholder="Nome do gato" />
                              <input type="text" required value={pet.idade} onChange={(e) => handlePetDetailChange('gatos', index, 'idade', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none text-sm" placeholder="Idade aprox. (ex: 6 meses)" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <label className="flex items-center gap-2 bg-slate-50 border border-dashed border-slate-300 rounded-lg p-2 cursor-pointer hover:bg-slate-100 transition-colors">
                                <Camera size={16} className="text-slate-500 flex-shrink-0" />
                                <span className="text-xs text-slate-600 truncate">{pet.fotoPet ? pet.fotoPet.name : "Foto do Pet (Obrigatório)"}</span>
                                <input type="file" required={!pet.fotoPet} accept="image/*" className="hidden" onChange={(e) => {
                                  if (e.target.files?.[0]) handlePetDetailChange('gatos', index, 'fotoPet', e.target.files[0]);
                                }} />
                              </label>
                              <label className="flex items-center gap-2 bg-slate-50 border border-dashed border-slate-300 rounded-lg p-2 cursor-pointer hover:bg-slate-100 transition-colors">
                                <UploadCloud size={16} className="text-slate-500 flex-shrink-0" />
                                <span className="text-xs text-slate-600 truncate">{pet.fotoVacina ? pet.fotoVacina.name : "Cartão de Vacina (Obrigatório)"}</span>
                                <input type="file" required={!pet.fotoVacina} accept="image/*,.pdf" className="hidden" onChange={(e) => {
                                  if (e.target.files?.[0]) handlePetDetailChange('gatos', index, 'fotoVacina', e.target.files[0]);
                                }} />
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" name="aceitaTermos" required checked={formData.aceitaTermos} onChange={handleInputChange} className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm text-slate-600 leading-relaxed">
                            Declaro que as informações e documentos acima são verdadeiros e que o rendimento familiar é de até 1 (um) salário mínimo por pessoa. Autorizo a SEMMAS a realizar verificações se necessário.
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Botões do Rodapé */}
                  <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between gap-4">
                    {formStep > 1 ? (
                      <button type="button" onClick={() => setFormStep(prev => prev - 1)} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-2 border-none bg-transparent">
                        <ChevronLeft size={18} /> Voltar
                      </button>
                    ) : (
                      <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors border-none bg-transparent">
                        Cancelar
                      </button>
                    )}
                    
                    <button type="submit" disabled={isSubmitting || (formStep === 3 && (formData.caes + formData.gatos < 3))} className="px-6 py-3 rounded-xl font-bold text-white bg-blue-900 hover:bg-blue-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border-none">
                      {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (formStep === 4 ? 'Finalizar Inscrição' : 'Avançar')} {(formStep < 4 && !isSubmitting) && <ChevronRight size={18} />}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONSULTA DE PROCESSO */}
      {showConsulta && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-sm" onClick={closeConsulta}></div>
          
          <div className="bg-white rounded-3xl w-full max-w-lg relative z-10 shadow-2xl flex flex-col animate-float" style={{ animation: 'none', transform: 'translateY(0)' }}>
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                  <Search size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-blue-900 text-lg">Consultar Processo</h3>
                </div>
              </div>
              <button onClick={closeConsulta} className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 md:p-8">
              {!resultadoConsulta ? (
                <form onSubmit={handleConsulta} className="space-y-6">
                  <p className="text-slate-600 text-sm">
                    Acompanhe o andamento da sua inscrição. Informe o seu CPF ou o Número de Protocolo gerado no momento do cadastro.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CPF ou Protocolo</label>
                    <input 
                      type="text" 
                      required 
                      value={consultaData} 
                      onChange={(e) => setConsultaData(e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                      placeholder="Ex: 000.000.000-00 ou MN-2026-1234" 
                    />
                  </div>
                  <button type="submit" disabled={isConsulting} className="w-full bg-blue-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 border-none">
                    {isConsulting ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />} Buscar Inscrição
                  </button>
                </form>
              ) : (
                <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                  <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="bg-blue-100 text-blue-700 p-3 rounded-full flex-shrink-0">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase mb-1">Protocolo</p>
                      <p className="font-mono text-xl font-black text-blue-900">{resultadoConsulta.protocolo}</p>
                      <p className="text-sm font-medium text-slate-600 mt-1">Tutor: {resultadoConsulta.nome}</p>
                      <p className="text-xs text-slate-400 mt-1">Realizado em {resultadoConsulta.data}</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl border border-yellow-200 bg-yellow-50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="text-yellow-600" size={20} />
                      <h4 className="font-bold text-yellow-800 text-lg">Status: {resultadoConsulta.status}</h4>
                    </div>
                    <p className="text-yellow-700 text-sm ml-7">{resultadoConsulta.mensagem}</p>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <button onClick={() => setResultadoConsulta(null)} className="w-full px-6 py-3 rounded-xl font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 transition-colors border-none bg-transparent">
                      Fazer Nova Consulta
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
