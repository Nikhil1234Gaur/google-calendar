const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.event.deleteMany();
  await prisma.event.createMany({
    data: [
      {
        title: 'Weekly Standup',
        description: 'Team sync',
        start: new Date('2025-11-24T09:00:00.000Z'),
        end: new Date('2025-11-24T09:30:00.000Z'),
        recurrence: 'FREQ=WEEKLY;BYDAY=MO,WE,FR'
      },
      {
        title: 'Project Planning',
        description: 'Plan next sprint',
        start: new Date('2025-11-26T14:00:00.000Z'),
        end: new Date('2025-11-26T15:30:00.000Z')
      },
      {
        title: 'All Day Hackathon',
        description: 'Hack day',
        start: new Date('2025-12-01T00:00:00.000Z'),
        end: new Date('2025-12-02T00:00:00.000Z'),
        allDay: true
      }
    ]
  });
  console.log('Seed finished.');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
