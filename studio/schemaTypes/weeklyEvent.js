export default {
  name: 'weeklyEvent',
  title: 'Weekly Event',
  type: 'document',
  fields: [
    {
      name: 'day',
      title: 'Day of Week',
      type: 'string',
      validation: Rule => Rule.required(),
      options: {
        list: [
          { title: 'Monday',    value: 'Monday'    },
          { title: 'Tuesday',   value: 'Tuesday'   },
          { title: 'Wednesday', value: 'Wednesday' },
          { title: 'Thursday',  value: 'Thursday'  },
          { title: 'Friday',    value: 'Friday'    },
          { title: 'Saturday',  value: 'Saturday'  },
          { title: 'Sunday',    value: 'Sunday'    },
        ],
      },
    },
    {
      name: 'eventName',
      title: 'Event Name',
      type: 'string',
      description: 'E.g. "Karaoke Night" or "Honky Tonk"',
      validation: Rule => Rule.required(),
    },
    {
      name: 'deals',
      title: 'Deals / Specials',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Add each deal or feature as a separate line',
    },
    {
      name: 'stampLines',
      title: 'Badge Text',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Short lines for the corner badge — usually 2 or 3 words each (e.g. "Grab", "The", "Mic")',
    },
    {
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      description: '1 = Monday, 2 = Tuesday, etc.',
    },
  ],
  preview: {
    select: { title: 'day', subtitle: 'eventName' },
    prepare: ({ title, subtitle }) => ({ title: `${title || 'New Event'}${subtitle ? ': ' + subtitle : ''}` }),
  },
};
