const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce(((acc, blog) => acc + blog.likes), 0)
}

const favoriteBlog = (blogs) => {
  let result = {}
  let maxLikes = 0
  blogs.forEach(blog => {
    if (blog.likes > maxLikes) {
      maxLikes = blog.likes
      result.title = blog.title
      result.author = blog.author
      result.likes = maxLikes
    }
  })
  return result
}

const mostBlogs = (blogs) => {
  let result = {}
  let authors = {}
  let maxBlogs = 0

  blogs.forEach(blog => {
    let numBlogs
    if (!authors[blog.author]) {
      authors[blog.author] = 1
      numBlogs = 1
    } else {
      authors[blog.author] += 1
      numBlogs = authors[blog.author]
    }
    if (numBlogs > maxBlogs) { maxBlogs = numBlogs }
  })

  for (let author in authors) {
    if (authors[author] === maxBlogs) {
      result.blogs = maxBlogs
      result.author = author
    }
  }
  return result
} 

const mostLikes = (blogs) => {
  let maxLikes = 0
  let authors = {}
  let result = {}
  blogs.forEach(blog => {
    let numLikes
    if (!authors[blog.author]) {
      numLikes = blog.likes
    } else {
      numLikes = authors[blog.author] + blog.likes
    }
    authors[blog.author] = numLikes
    if (numLikes > maxLikes) { maxLikes = numLikes }
  })

  for (let author in authors) {
    if (authors[author] === maxLikes) {
      result.likes = maxLikes
      result.author = author
    }
  }
  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}