$(function () {
  $.getJSON("/json/tournaments.json", function (tnm) {
    $.getJSON("/json/players.json", function (plyr) {
      const param = location.search;
      const getP = (t, n) => {
        try {
          return t.split(n + '=')[1].split('&')[0];
        } catch (e) {
          console.log(e.messsage);
          return undefined;
        }
      }
      const rankParse = (eng) => {
        const list = {
          'first': '優勝',
          'second': '準優勝',
          'third': '3位',
          'fourth': '4位',
          'fifth': '5位',
          'sixth': '6位',
          'seventh': '7位',
          'eighth': '8位',
          'ninth': '9位',
          'tenth': '10位',
          'eleventh': '11位',
          'twelfth': '12位',
        }
        try {
          return list[eng];
        } catch (e) {
          console.log(e.messsage);
          return undefined;
        }
      }
      const getPlayerName = (array, plyrId) => {
        try {
          return array.find(({id}) => id === plyrId).name;
        } catch (e) {
          console.log(e.messsage);
          return undefined;
        }
      }
      const tnmId = getP(param, 'id');
      const index = tnm.findIndex(({ id }) => id === tnmId);
      if (index === -1) {
        let htmlText = '<ol>';
        for (let i in tnm) {
          const date = tnm[i].date.split('-');
          htmlText += `<ul><a href="index.html?id=${tnm[i].id}">${tnm[i].title} - ${Number(date[1])}/${Number(date[2])}</a></ul>`
        }
        htmlText += '</ol>';
        $('h2#title').html('大会結果一覧');
        $('div#list').html(htmlText);
      } else {
        const data = tnm[index];
        console.log(data);
        const title = data.title;
        const author = data.author;
        const formatList = ['個人(FFA)', 'タッグ(2v2)', 'トリプルス(3v3)', 'フォーマンセル(4v4)', '', 'チーム(6v6)']
        const format = formatList[data.format - 1];
        const date = data.date.replace(/-/g, '/');
        let text = '';
        for (let i in data.finals) {
          const rank = rankParse(i);
          const team = data.finals[i];
          const tag = team.tag;
          let detail = '';
          for (let j in team.players) {
            const player = team.players[j];
            if (data.format == 1) {
              detail += `<div class="player"><a class="name" href="/players/index.html?id=${player.id}">${getPlayerName(plyr, player.id)}</a><div class="points"></div></div>`
            }
            else {
              detail += `<div class="player"><a class="name" href="/players/index.html?id=${player.id}">${getPlayerName(plyr, player.id)}</a><div class="points">${player.points}pts</div></div>`
            }
          }
          const sum = team.points;
          text += `<div class="team" id="${i}"><div class="team_head" id=${i}><div class="rank">${rank}</div><div class="tag">${tag}</div><div class="sum">${sum}pts</div></div></div>${detail}</div>`;
        }
        $('h2#title').html(title + ' 大会結果');
        $('div#comment').html(`主催は${author}、形式は${format}、決勝日は${date}。`)
        $('div#finals_table').html(text)
      }
    })
  })
});