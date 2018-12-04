export const findInTree = function (tree, k, v, cn) {
  let result = null
  if (Array.isArray(tree)) {
    for (let i in tree) {
      result = findInTree(tree[i], k, v, cn)
      if (result !== null) {
        break
      }
    }
  } else if (tree[k] === v) {
    result = tree;
  } else if (!!tree[cn] && tree[cn].length > 0) {
    for (let i in tree[cn]) {
      result = findInTree(tree[cn][i], k, v, cn)
      if (result !== null) {
        break
      }
    }
  }
  return result
}

export const findPathInTree = function (tree, k, v, cn) {
  let result = []

  function find(tree, k, v, cn) {

    if (tree[k] === v) {
        return [tree]
    }

    if (!!tree[cn] && tree[cn].length > 0) {
      let t;
      for (let i in tree) {
        t = find(tree[i], k, v, cn)
        if (t !== null && t.length > 0) {
          let r = [tree]
          t.forEach((e) => {
            r.push(e)
          })
          return r
        }
      }
    }
    return null
  }

  if (Array.isArray(tree)) {
    for (let i in tree) {
      result = find(tree[i], k, v, cn)
      if (result !== null && result.length > 0) {
        return result
      }
    }
  } else {
    result = find(tree, k, v, cn)
    if (result !== null && result.length > 0) {
      return result
    }
  }
  return []
}
