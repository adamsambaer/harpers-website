export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Only one document of this type should ever exist
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'phone',
      title: 'Main Phone Number',
      type: 'string',
      description: 'E.g. 517-333-4040',
    },
    {
      name: 'email',
      title: 'Main Email Address',
      type: 'string',
    },
    {
      name: 'hoursDisplay',
      title: 'Hours (display text)',
      type: 'string',
      description: 'Shown in the Find Us section and footer. E.g. "12:00pm – 2:00am"',
    },
    {
      name: 'shellyPhone',
      title: 'Private Events Phone (Shelly)',
      type: 'string',
      description: 'Shown in the Private Events booking section',
    },
    {
      name: 'shellyAvailability',
      title: "Shelly's Availability",
      type: 'string',
      description: 'E.g. "Mon–Fri, 9am–5pm"',
    },
  ],
};
