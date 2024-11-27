import React from "react"

const Show = ({ when, children }) => {
  if (when) {
    return children
  }
}

export default Show
