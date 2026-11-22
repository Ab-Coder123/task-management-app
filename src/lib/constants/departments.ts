export interface CompanyTeam {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  iconName: 'Code2' | 'Palette' | 'Kanban' | 'Megaphone' | 'Briefcase' | 'Settings2';
  jobs: string[];
}

export const COMPANY_TEAMS: CompanyTeam[] = [
  {
    id: 'engineering',
    name: 'فريق التطوير والبرمجة',
    nameEn: 'Engineering & Tech',
    description: 'تطوير الويب والموبايل، البنية التحتية السحابية، وضمان الجودة.',
    iconName: 'Code2',
    jobs: [
      'Frontend Developer',
      'Backend Developer',
      'Full Stack Developer',
      'Mobile App Developer',
      'DevOps & Cloud Engineer',
      'QA & Software Tester',
      'AI & Data Engineer',
    ],
  },
  {
    id: 'design',
    name: 'فريق التصميم وتجربة المستخدم',
    nameEn: 'Product Design & UI/UX',
    description: 'تصميم واجهات المستخدم، تجربة العميل، والهوية البصرية.',
    iconName: 'Palette',
    jobs: [
      'UI/UX Designer',
      'Product Designer',
      'Graphic & Brand Designer',
      'Motion Graphics Designer',
    ],
  },
  {
    id: 'product',
    name: 'فريق إدارة المنتجات والمشاريع',
    nameEn: 'Product & Project Management',
    description: 'تخطيط خارطة الطريق، إدارة السبرنت، وتحليل متطلبات العمل.',
    iconName: 'Kanban',
    jobs: [
      'Product Manager',
      'Project Manager',
      'Scrum Master',
      'Business Analyst',
    ],
  },
  {
    id: 'marketing',
    name: 'فريق التسويق والنمو',
    nameEn: 'Marketing & Growth',
    description: 'إدارة الحملات الرقمية، صناعة المحتوى، واستراتيجيات النمو.',
    iconName: 'Megaphone',
    jobs: [
      'Digital Marketing Specialist',
      'Content Creator & Copywriter',
      'Social Media Manager',
      'SEO / Performance Specialist',
      'Growth Specialist',
    ],
  },
  {
    id: 'sales',
    name: 'فريق المبيعات وتطوير الأعمال',
    nameEn: 'Sales & Business Development',
    description: 'توسيع قاعدة العملاء، إدارة الحسابات، وتحقيق أهداف المبيعات.',
    iconName: 'Briefcase',
    jobs: [
      'Sales Executive',
      'Business Development Manager',
      'Account Manager',
      'Customer Success Specialist',
    ],
  },
  {
    id: 'operations',
    name: 'فريق العمليات والموارد البشرية',
    nameEn: 'Operations & HR',
    description: 'إدارة شؤون الموظفين، التوظيف، التنسيق الإداري، والدعم الفني.',
    iconName: 'Settings2',
    jobs: [
      'HR & People Operations',
      'Talent Acquisition Specialist',
      'Operations Coordinator',
      'Financial & Admin Specialist',
      'Technical Support Engineer',
    ],
  },
];
