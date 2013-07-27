var abilities = [
{
  title: 'canViewMembers',
  label: "View Members",
  permissions: {
    'api/members': [ 'read' ]
  }
},
{
  title: 'canEditMembers',
  label: "Edit Members",
  permissions: {
    'api/members': [ 'read', 'write' ],
  }
},
{
  title: 'canWebSearch',
  label: "Web Search",
  permissions: {
    'api/webSearch': [ 'read', 'write' ],
    'api/publications': [ 'read', 'write' ]
  }
},
{
  title: 'canEditPublications',
  label: "Edit Publications",
  permissions: {
    'api/publications': [ 'read', 'write' ]
  }
},
{
  title: 'canManageUsers',
  label: "Manage Users",
  permissions: {
    'api/manageUsers': [ 'read', 'write' ]
  }
},
]
db.abilities.drop();
db.abilities.insert(abilities)
