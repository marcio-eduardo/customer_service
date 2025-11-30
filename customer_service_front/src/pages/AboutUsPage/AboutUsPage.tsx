// Localização: src/pages/AboutUsPage/AboutUsPage.tsx

import { Helmet } from 'react-helmet-async';

// Ícones
const VisionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 mx-auto mb-4 text-tas-primary">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);
const TeamIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 mx-auto mb-4 text-tas-secondary">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

export function AboutUsPage() {
  const pageWrapperClasses = `min-h-screen pt-16 bg-tas-bg-page text-tas-text-on-card`;
  const contentContainerClasses = "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12";
  const pageHeaderTextClasses = 'text-tas-primary';
  const sectionTitleTextClasses = 'text-tas-secondary';
  const paragraphClasses = 'text-tas-text-on-card text-lg leading-relaxed mb-4';
  const cardClasses = 'bg-tas-bg-card p-6 md:p-8 rounded-xl shadow-xl border border-black/10';

  return (
    <>
      <Helmet>
        <title>Sobre Nós - TAS</title>
      </Helmet>
      <div className={pageWrapperClasses}>
        <div className={contentContainerClasses}>
          <header className="mb-12 text-center">
            <h1 className={`text-4xl lg:text-5xl font-bold ${pageHeaderTextClasses}`}>
              Sobre o Trust Assist System (TAS)
            </h1>
          </header>

          <section className={`${cardClasses} mb-12`}>
            <div className="text-center mb-6">
              <TeamIcon />
              <h2 className={`text-3xl font-semibold ${sectionTitleTextClasses}`}>Quem Somos</h2>
            </div>
            <p className={paragraphClasses}>
              Somos uma equipe apaixonada por tecnologia e inovação, dedicada a criar soluções que transformam desafios complexos em processos simples e eficientes. O Trust Assist System (TAS) nasceu da nossa crença de que a confiança é a base de qualquer interação bem-sucedida, e que a tecnologia pode ser uma poderosa aliada para construir e fortalecer essa confiança.
            </p>
            <p className={paragraphClasses}>
              Com foco na experiência do usuário e na robustez dos nossos sistemas, procuramos oferecer ferramentas que não só atendam às necessidades atuais dos nossos clientes, mas que também os preparem para o futuro, promovendo crescimento e otimização contínua.
            </p>
          </section>

          <section className={cardClasses}>
            <div className="text-center mb-6">
              <VisionIcon />
              <h2 className={`text-3xl font-semibold ${sectionTitleTextClasses}`}>Nossa Visão</h2>
            </div>
            <p className={paragraphClasses}>
              A visão do Trust Assist System (TAS) é ser a plataforma de referência em soluções de gestão que inspiram **confiança** e otimizam a **assistência**, transformando radicalmente a forma como as empresas interagem com seus clientes e gerem seus processos internos.
            </p>
            <p className={paragraphClasses}>
              Acreditamos num futuro onde a tecnologia atua como uma facilitadora invisível, permitindo que as organizações se concentrem no que realmente importa: construir relacionamentos sólidos e fornecer valor excepcional.
            </p>
            <p className={paragraphClasses}>
              O TAS empenha-se em ser sinônimo de fiabilidade, inteligência e simplicidade, capacitando nossos usuários a alcançar novos patamares de eficiência e satisfação do cliente.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}