var abilities = [
{
  label: 'canViewMembers',
  permissions: {
    'api/members': [ 'read' ]
  }
},
{
  label: 'canEditMembers',
  permissions: {
    'api/members': [ 'read', 'write' ]
  }
},
{
  label: 'canWebSearch',
  permissions: {
    'api/webSearch': [ 'read', 'write' ]
  }
},
{
  label: 'canEditPublications',
  permissions: {
    'api/publications': [ 'read', 'write' ]
  }
},
]
abilities.forEach(function(ability) {
  db.abilities.insert(ability);
});
