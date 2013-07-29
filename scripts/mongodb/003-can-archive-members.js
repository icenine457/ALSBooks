var newAbility = {
  title: 'canArchiveMemberPublications',
  label: "Archive Publications",
  permissions: {
    'api/archive/publications': [ 'read' ]
  }
}
db.abilities.insert(newAbility)
