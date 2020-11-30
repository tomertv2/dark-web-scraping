const scraper = require('./scraper.js');
const { Post } = require('./models');

const fetchNewData = async () => {
  try {
    const posts = await scraper();
    for (const post of posts) {
      const check = await Post.findOne({
        where: { title: post.title, content: post.content },
      });
      if (!check) {
        await Post.create(post);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

setInterval(fetchNewData, 120000);
