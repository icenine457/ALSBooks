var newAbility = {
  title: 'canArchiveMemberPublications',
  label: "Archive Publications",
  permissions: {
    'api/archive/publications': [ 'delete' ]
  }
}
db.abilities.insert(newAbility)
