/**
 * Public name: Sofiia Totska.
 * Evidence: git author `totskaiasonia <totskaiasonia@gmail.com>` is the
 * primary committer on MedSahra, La Boucherie, tags.ly, and Family Olive Club.
 * Uncertainty: this Mac account is Viktoriia Leshchova; that name does not
 * appear in those repos’ commit authors or live site bylines.
 */
export const person = {
  given: 'Sofiia',
  family: 'Totska',
  display: 'Sofiia Totska',
  mark: 'ST',
  title: 'Product engineer · interface systems',
  email: 'totskaiasonia@gmail.com',
  github: 'https://github.com/totskaiasonia',
  githubHandle: 'totskaiasonia',
  linkedin: 'https://linkedin.com/in/totska-sofiia',
  telegram: 'https://t.me/totskasofiia',
  telegramHandle: 'totskasofiia',
  whatsapp: 'https://wa.me/380675207971',
  phone: '+380675207971',
  portrait: '/portrait.jpg',
  location: 'Dubai · remote',
  tagline:
    'I ship bilingual marketplaces, subscription commerce, and ops tooling — from public SSR to admin queues.',
} as const;

export const contacts = [
  {
    id: 'mail',
    label: 'Email',
    href: `mailto:${person.email}`,
    hint: person.email,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: person.linkedin,
    hint: 'totska-sofiia',
  },
  {
    id: 'github',
    label: 'GitHub',
    href: person.github,
    hint: `@${person.githubHandle}`,
  },
  {
    id: 'telegram',
    label: 'Telegram',
    href: person.telegram,
    hint: `@${person.telegramHandle}`,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: person.whatsapp,
    hint: person.phone,
  },
] as const;
