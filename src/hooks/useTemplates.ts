import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { FeedbackTemplate, FeedbackCategory } from '../types';

const DEFAULT_TEMPLATES: FeedbackTemplate[] = [
  // Productos Académicos
  { 
    id: '1', 
    workTypeId: 'productos_academicos', 
    category: 'excelente', 
    content: 'Tu trabajo demuestra un dominio sobresaliente del tema, con ideas bien estructuradas y un análisis profundo que refleja dedicación y comprensión. ¡Felicitaciones por este excelente resultado! Sigue así, vas por muy buen camino.' 
  },
  { 
    id: '2', 
    workTypeId: 'productos_academicos', 
    category: 'bueno', 
    content: 'Tu trabajo está bien desarrollado y se nota el esfuerzo que has puesto. Tienes una buena comprensión del tema y las ideas están organizadas de manera clara. Para seguir mejorando, te sugiero profundizar un poco más en el análisis. Cualquier duda que tengas, con gusto te ayudo a resolverla.' 
  },
  { 
    id: '3', 
    workTypeId: 'productos_academicos', 
    category: 'regular', 
    content: 'Tu trabajo cumple con lo básico, pero noto que hay aspectos que podemos mejorar juntos, especialmente en la profundidad del contenido y la organización de las ideas. Te invito a revisar nuevamente las indicaciones y, si tienes dudas sobre cómo fortalecer tu trabajo, no dudes en preguntarme. Estoy aquí para apoyarte.' 
  },
  { 
    id: '4', 
    workTypeId: 'productos_academicos', 
    category: 'debe_mejorar', 
    content: 'He revisado tu trabajo y veo que necesita algunas mejoras importantes en contenido y estructura. Entiendo que a veces los temas pueden ser complicados, pero quiero que sepas que cuentas conmigo para salir adelante. Te propongo que nos reunamos o me escribas para orientarte mejor y trabajar juntos en mejorar. ¡Ánimo, sé que puedes lograrlo!' 
  },
  { 
    id: '5', 
    workTypeId: 'productos_academicos', 
    category: 'no_presento', 
    content: 'Noté que no recibí tu trabajo en esta oportunidad. Entiendo que pueden surgir imprevistos o dificultades, y me gustaría saber cómo te encuentras. Si tienes algún inconveniente, házmelo saber para buscar una solución juntos. Cuenta conmigo.' 
  },
  
  // Presentaciones
  { 
    id: '6', 
    workTypeId: 'presentaciones', 
    category: 'excelente', 
    content: 'Tu presentación fue excelente. Demostraste dominio del tema, claridad al exponer y muy buen manejo del tiempo y los recursos visuales. ¡Felicitaciones! Se nota tu preparación y esfuerzo. Sigue desarrollando estas habilidades, tienes mucho potencial.' 
  },
  { 
    id: '7', 
    workTypeId: 'presentaciones', 
    category: 'bueno', 
    content: 'Tu presentación estuvo bien lograda, con buen manejo del tema y una exposición clara. Para llevarla al siguiente nivel, te sugiero practicar un poco más la fluidez y el contacto visual con tu audiencia. Si quieres, podemos practicar juntos o darte algunos tips. ¡Vas muy bien!' 
  },
  { 
    id: '8', 
    workTypeId: 'presentaciones', 
    category: 'regular', 
    content: 'Tu presentación cumplió con lo básico, pero hay oportunidades de mejora en el dominio del tema y la claridad de la exposición. Te recomiendo practicar más antes de exponer y revisar bien el contenido. Si necesitas orientación sobre cómo preparar mejor tus presentaciones, cuenta conmigo para ayudarte.' 
  },
  { 
    id: '9', 
    workTypeId: 'presentaciones', 
    category: 'debe_mejorar', 
    content: 'Noté que tu presentación necesita más preparación tanto en contenido como en la forma de exponer. Sé que hablar en público puede ser un reto, pero es una habilidad que se desarrolla con práctica. Si necesitas orientación o quieres practicar, con gusto te apoyo. ¡Tú puedes!' 
  },
  { 
    id: '10', 
    workTypeId: 'presentaciones', 
    category: 'no_presento', 
    content: 'Noté que no participaste en la presentación programada. Las exposiciones son importantes para tu formación y desarrollo profesional. Si tuviste algún inconveniente, házmelo saber y buscamos una alternativa. Estoy para apoyarte.' 
  },
  
  // Competencias y Habilidades
  { 
    id: '11', 
    workTypeId: 'competencias_habilidades', 
    category: 'excelente', 
    content: 'Demuestras un excelente desarrollo de las competencias técnicas evaluadas. Tu desempeño refleja práctica, dedicación y autonomía. ¡Felicitaciones por este logro! Continúa así y si quieres explorar técnicas más avanzadas, con gusto te oriento.' 
  },
  { 
    id: '12', 
    workTypeId: 'competencias_habilidades', 
    category: 'bueno', 
    content: 'Muestras un buen desarrollo de las habilidades técnicas requeridas. Se nota tu práctica y dedicación. Para alcanzar un nivel superior, te sugiero seguir practicando con constancia y prestar atención a los detalles. Si necesitas recursos adicionales o tienes dudas, aquí estoy para apoyarte.' 
  },
  { 
    id: '13', 
    workTypeId: 'competencias_habilidades', 
    category: 'regular', 
    content: 'Tu desarrollo de competencias técnicas está en un nivel básico y hay aspectos que podemos fortalecer. Te animo a dedicar más tiempo a la práctica y a seguir los procedimientos paso a paso. Si tienes dificultades o dudas, no dudes en preguntarme. Juntos podemos trabajar para que mejores.' 
  },
  { 
    id: '14', 
    workTypeId: 'competencias_habilidades', 
    category: 'debe_mejorar', 
    content: 'Veo que hay áreas importantes que necesitas reforzar en tus habilidades técnicas. Quiero que sepas que esto es parte del proceso de aprendizaje y que estoy aquí para ayudarte. Te propongo que nos reunamos para crear un plan de práctica que te permita avanzar. ¡No te desanimes, con dedicación lo vas a lograr!' 
  },
  { 
    id: '15', 
    workTypeId: 'competencias_habilidades', 
    category: 'no_presento', 
    content: 'No pude evaluar tus competencias en esta oportunidad porque no participaste en la actividad práctica. Si tuviste alguna dificultad, me gustaría saberlo para ver cómo podemos avanzar. Cuenta conmigo para apoyarte.' 
  },
  
  // Participación
  { 
    id: '16', 
    workTypeId: 'participacion', 
    category: 'excelente', 
    content: 'Tu participación en clase ha sido excelente. Tus aportes son valiosos, muestras una actitud proactiva y contribuyes positivamente al aprendizaje de todos. ¡Felicitaciones! Sigue así, tu compromiso es admirable.' 
  },
  { 
    id: '17', 
    workTypeId: 'participacion', 
    category: 'bueno', 
    content: 'Tu participación en clase es buena y tus intervenciones son pertinentes. Te animo a seguir compartiendo tus ideas con el grupo, ya que tus aportes enriquecen nuestras sesiones. Si tienes alguna inquietud o sugerencia, siempre estoy dispuesto a escucharte.' 
  },
  { 
    id: '18', 
    workTypeId: 'participacion', 
    category: 'regular', 
    content: 'He notado que tu participación en clase ha sido limitada últimamente. Me gustaría que te involucres más en las actividades y discusiones, ya que tu opinión es importante. Si hay algo que te impide participar o te sientes incómodo, cuéntame y buscaremos la forma de apoyarte.' 
  },
  { 
    id: '19', 
    workTypeId: 'participacion', 
    category: 'debe_mejorar', 
    content: 'Noto que tu participación en las actividades de clase ha sido muy baja y esto puede afectar tu aprendizaje. Me preocupa tu situación y quiero ayudarte. Si hay algo que te está pasando o alguna dificultad que enfrentas, por favor cuéntame. Estoy aquí para escucharte y buscar soluciones juntos.' 
  },
  { 
    id: '20', 
    workTypeId: 'participacion', 
    category: 'no_presento', 
    content: 'No he podido registrar tu participación en las actividades de clase durante este período. Me gustaría saber si hay algo en lo que pueda ayudarte para retomar el ritmo. Cualquier duda o situación que tengas, con confianza házmelo saber.' 
  },
  
  // Plataformas Externas
  { 
    id: '21', 
    workTypeId: 'plataformas_externas', 
    category: 'excelente', 
    content: 'Tu desempeño en la plataforma ha sido excelente. Completaste todas las actividades con muy buenos resultados, lo que demuestra tu compromiso y autonomía. ¡Felicitaciones! Sigue aprovechando estos recursos para tu formación.' 
  },
  { 
    id: '22', 
    workTypeId: 'plataformas_externas', 
    category: 'bueno', 
    content: 'Tu desempeño en la plataforma es bueno. Has completado las actividades de manera satisfactoria y se nota tu interés por aprender. Te animo a seguir explorando los contenidos adicionales que ofrece. Si tienes dudas sobre cómo usar mejor la plataforma, con gusto te oriento.' 
  },
  { 
    id: '23', 
    workTypeId: 'plataformas_externas', 
    category: 'regular', 
    content: 'Tu avance en la plataforma es básico y hay actividades pendientes por completar. Te recomiendo dedicar un poco más de tiempo a esta herramienta, ya que complementa lo que vemos en clase. Si tienes problemas técnicos o de acceso, avísame y lo resolvemos juntos.' 
  },
  { 
    id: '24', 
    workTypeId: 'plataformas_externas', 
    category: 'debe_mejorar', 
    content: 'Veo que tu avance en la plataforma es muy bajo y tienes varias actividades sin completar. Entiendo que a veces puede ser complicado organizarse o pueden surgir problemas técnicos. Cuéntame qué está pasando para poder ayudarte. Juntos podemos encontrar la manera de que te pongas al día.' 
  },
  { 
    id: '25', 
    workTypeId: 'plataformas_externas', 
    category: 'no_presento', 
    content: 'No he visto actividad tuya en la plataforma durante este período. Si tienes alguna dificultad de acceso, conectividad u otro inconveniente, házmelo saber para buscar una solución. Estoy para ayudarte a que puedas avanzar.' 
  },
];

export function useTemplates() {
  const [templates, setTemplates] = useLocalStorage<FeedbackTemplate[]>('templatesV2', DEFAULT_TEMPLATES);

  const addTemplate = useCallback((workTypeId: string, category: FeedbackCategory, content: string) => {
    const newTemplate: FeedbackTemplate = {
      id: crypto.randomUUID(),
      workTypeId,
      category,
      content: content.trim(),
    };
    setTemplates(prev => [...prev, newTemplate]);
    return newTemplate;
  }, [setTemplates]);

  const updateTemplate = useCallback((id: string, updates: Partial<Omit<FeedbackTemplate, 'id'>>) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, [setTemplates]);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  }, [setTemplates]);

  const getTemplatesByWorkType = useCallback((workTypeId: string) => {
    return templates.filter(t => t.workTypeId === workTypeId);
  }, [templates]);

  const getTemplate = useCallback((workTypeId: string, category: FeedbackCategory) => {
    return templates.find(t => t.workTypeId === workTypeId && t.category === category);
  }, [templates]);

  return {
    templates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplatesByWorkType,
    getTemplate,
  };
}
