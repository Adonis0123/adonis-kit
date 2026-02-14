import React from 'react'

export function getDisplayName(node: React.ComponentType<any>) {
  return node.displayName || node.name || 'Component'
}
