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
    content: 'Durante este periodo has demostrado habilidades excepcionales. Tu capacidad de comunicación, trabajo en equipo y resolución de problemas es admirable. Participas activamente, escuchas a tus compañeros, aportas ideas creativas y te adaptas con facilidad a nuevos desafíos. Tu liderazgo natural y empatía enriquecen el ambiente de aprendizaje. ¡Sigue desarrollando estas valiosas competencias personales!' 
  },
  { 
    id: '12', 
    workTypeId: 'competencias_habilidades', 
    category: 'bueno', 
    content: 'Has mostrado buenas habilidades personales durante este ciclo. Comunicas tus ideas con claridad, colaboras con tus compañeros cuando se requiere y demuestras capacidad para resolver problemas. Para fortalecer aún más estas habilidades, te sugiero participar más activamente en actividades grupales y buscar oportunidades de liderazgo. ¡Vas por excelente camino!' 
  },
  { 
    id: '13', 
    workTypeId: 'competencias_habilidades', 
    category: 'regular', 
    content: 'Tu desarrollo de habilidades personales ha sido básico durante este periodo. He notado que puedes mejorar en comunicación, participación en equipo y resolución de problemas. A veces te cuesta expresar tus ideas o integrarte activamente en las actividades grupales. Te animo a involucrarte más, practicar la escucha activa y atreverte a proponer soluciones. Estoy aquí para ayudarte a crecer en estas áreas.' 
  },
  { 
    id: '14', 
    workTypeId: 'competencias_habilidades', 
    category: 'debe_mejorar', 
    content: 'He observado que necesitas reforzar significativamente tus habilidades personales este ciclo. Aspectos como la comunicación, el trabajo colaborativo, la creatividad y la resolución de problemas requieren atención. Entiendo que estas habilidades se desarrollan con práctica y confianza. Te propongo que trabajemos juntos en un plan personalizado: ejercicios de comunicación, dinámicas de equipo y metodologías para resolver desafíos. ¡Puedes lograrlo, cuenta conmigo!' 
  },
  { 
    id: '15', 
    workTypeId: 'competencias_habilidades', 
    category: 'no_presento', 
    content: 'No he podido evaluar tus habilidades personales durante este periodo ya que no se ha observado tu participación en actividades grupales, discusiones o ejercicios colaborativos. Me preocupa tu aislamiento y quiero entender qué te está sucediendo. Por favor, acércate para que podamos conversar y buscar la manera de integrarte. Tu desarrollo en estas competencias es fundamental para tu futuro profesional.' 
  },
  
  // Actitudes (Subcategoría de Competencias y Habilidades)
  { 
    id: 'act-1', 
    workTypeId: 'competencias_habilidades', 
    category: 'excelente', 
    content: 'A lo largo de este ciclo académico has demostrado una actitud ejemplar. Eres puntual, responsable con tus compromisos, respetuoso con compañeros y docentes. Tu integridad, honestidad y comportamiento ético son admirables. Muestras entusiasmo por aprender, perseverancia ante los desafíos y una disposición positiva que inspira a los demás. ¡Eres un modelo a seguir!' 
  },
  { 
    id: 'act-2', 
    workTypeId: 'competencias_habilidades', 
    category: 'bueno', 
    content: 'Durante este periodo has mantenido una actitud positiva. Generalmente cumples con tus responsabilidades, respetas a tus compañeros y muestras disposición para colaborar. Valoro tu compromiso con el aprendizaje y tu comportamiento respetuoso. Para seguir creciendo, te animo a fortalecer tu proactividad, asumir más iniciativa y mantener la consistencia en tu entusiasmo. ¡Sigue así!' 
  },
  { 
    id: 'act-3', 
    workTypeId: 'competencias_habilidades', 
    category: 'regular', 
    content: 'Tu actitud durante este ciclo ha sido irregular. He notado algunos aspectos positivos, pero también hay áreas por mejorar como la puntualidad, la consistencia en tu compromiso o la forma de relacionarte con el grupo. A veces muestras desinterés o falta de entusiasmo. Reflexiona sobre cómo una actitud positiva impacta tu aprendizaje y el de los demás. Estoy disponible para conversar y orientarte.' 
  },
  { 
    id: 'act-4', 
    workTypeId: 'competencias_habilidades', 
    category: 'debe_mejorar', 
    content: 'Me preocupa tu actitud durante este periodo académico. He observado dificultades en la puntualidad, responsabilidad con tus compromisos, respeto hacia el grupo o disposición para el aprendizaje. Estas actitudes son fundamentales para tu éxito profesional. Entiendo que pueden existir factores personales afectándote. Te invito sinceramente a conversar conmigo para entender tu situación y trabajar juntos en un cambio positivo. ¡Confío en que puedes mejorar!' 
  },
  { 
    id: 'act-5', 
    workTypeId: 'competencias_habilidades', 
    category: 'no_presento', 
    content: 'No he podido evaluar tus actitudes durante este ciclo debido a tu inasistencia constante, falta de participación o desconexión de las actividades académicas. Esto me preocupa considerablemente ya que las actitudes son tan importantes como los conocimientos técnicos. Por favor, acércate urgentemente para conversar sobre tu situación y encontrar juntos una solución. Estoy aquí para apoyarte.' 
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
