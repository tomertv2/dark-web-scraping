const express = require('express');
const { Post } = require('./models');
const { Op } = require('sequelize');

const app = express();
app.use(express.json());

const dayInMilliseconds = 1000 * 60 * 60 * 24;
const weekInMilliseconds = dayInMilliseconds * 7;

// Get all posts from db
app.get('/posts', async (req, res) => {
  try {
    const allPosts = await Post.findAll();
    res.json(allPosts);
  } catch (error) {
    console.log('Error occurred: ', error);
  }
});

// Get post by id
app.get('/post/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    res.json(post);
  } catch (error) {
    console.log('Error occurred: ', error);
  }
});

// Get filtered posts
app.get('/search/:search', async (req, res) => {
  try {
    const search = `%${req.params.search}%`;
    const allPosts = await Post.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: search,
            },
          },
          {
            content: {
              [Op.like]: search,
            },
          },
          {
            author: {
              [Op.like]: search,
            },
          },
          {
            date: {
              [Op.like]: search,
            },
          },
        ],
      },
    });
    res.json(allPosts);
  } catch (error) {
    console.log('Error occurred: ', error);
  }
});

app.get('/filter/byDays/:offset', async (req, res) => {
  try {
    const offset = parseInt(req.params.offset);

    const afterWeek = new Date(offset).getTime() + weekInMilliseconds;

    const byDayArr = [];

    for (let i = offset; i < afterWeek; i += dayInMilliseconds) {
      const postsBetweenDates = await Post.findAll({
        where: {
          date: {
            [Op.between]: [new Date(i), new Date(i + dayInMilliseconds)],
          },
        },
        raw: true,
      });

      byDayArr.push({
        date: new Date(i).toLocaleDateString(),
        count: postsBetweenDates.length,
      });
    }

    console.log(byDayArr);

    res.json(byDayArr);
  } catch (error) {
    console.log('Error occurred: ', error);
  }
});

app.get('/filter/byHours/:offset', async (req, res) => {
  try {
    const offset = parseInt(req.params.offset);

    const byHoursArr = [
      {
        hour: '00:00',
        count: 0,
      },
      {
        hour: '01:00',
        count: 0,
      },
      {
        hour: '02:00',
        count: 0,
      },
      {
        hour: '03:00',
        count: 0,
      },
      {
        hour: '04:00',
        count: 0,
      },
      {
        hour: '05:00',
        count: 0,
      },
      {
        hour: '06:00',
        count: 0,
      },
      {
        hour: '07:00',
        count: 0,
      },
      {
        hour: '08:00',
        count: 0,
      },
      {
        hour: '09:00',
        count: 0,
      },
      {
        hour: '10:00',
        count: 0,
      },
      {
        hour: '11:00',
        count: 0,
      },
      {
        hour: '12:00',
        count: 0,
      },
      {
        hour: '13:00',
        count: 0,
      },
      {
        hour: '14:00',
        count: 0,
      },
      {
        hour: '15:00',
        count: 0,
      },
      {
        hour: '16:00',
        count: 0,
      },
      {
        hour: '17:00',
        count: 0,
      },
      {
        hour: '18:00',
        count: 0,
      },
      {
        hour: '19:00',
        count: 0,
      },
      {
        hour: '20:00',
        count: 0,
      },
      {
        hour: '21:00',
        count: 0,
      },
      {
        hour: '22:00',
        count: 0,
      },
      {
        hour: '23:00',
        count: 0,
      },
    ];

    const postsOnDate = await Post.findAll({
      where: {
        date: {
          [Op.between]: [
            new Date(offset),
            new Date(offset + dayInMilliseconds),
          ],
        },
      },
      raw: true,
    });

    for (const post of postsOnDate) {
      const postHour = post.date.getHours();
      byHoursArr[postHour].count++;
    }

    res.json(byHoursArr);
  } catch (error) {
    console.log('Error occurred: ', error);
  }
});

module.exports = app;
