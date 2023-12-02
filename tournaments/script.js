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
        let htmlText = '<ul>';
        for (let i in tnm) {
          const date = tnm[i].date.split('-');;
          const title = tnm[i].title.replace('MKCentral ', '');
          htmlText += `<li><a href="index.html?id=${tnm[i].id}">${Number(date[1])}/${Number(date[2])} - ${title}</a></li>`
        }
        htmlText += '</ul>';
        $('h2#title').html('決勝結果一覧');
        $('div#list').html(htmlText);
      } else {
        const data = tnm[index];
        console.log(data);
        const title = data.title;
        const author = data.author;
        const formatList = ['', '個人(FFA)', 'タッグ(2v2)', 'トリプルス(3v3)', 'フォーマンセル(4v4)', '', 'チーム(6v6)']
        const format = formatList[data.format];
        const [year, month, day] = data.date.split('-');
        const date = `${year}年${month}月${day}日`
        const url = data.url;
        $('h2#title').html(title + ' 大会結果');
        $('div#comment').html(`<p>主催は${author}、形式は${format}、決勝日は${date}。</p><p>→<a href="${url}" target="_blank" rel="noopener noreferrer">大会サイト</a></p>`)
        let text = '';
        let sum = 0;
        let rankEng = '';
        let rank = '';
        for (let i in data.finals) {
          const team = data.finals[i];
          const tag = team.tag;
          let detail = '';
          if (sum !== team.points) {
            rankEng = i;
            rank = rankParse(i);
          }
          sum = team.points;
          for (let j in team.players) {
            const player = team.players[j];
            const playerName = getPlayerName(plyr, player.id);
            let [playerNameText, playerPointsText] = [];
            if (playerName === undefined) {
              playerNameText = `<a class="name" href="">-</a>`;
            } else {
              playerNameText = `<a class="name" href="/players/index.html?id=${player.id}">${getPlayerName(plyr, player.id)}</a>`;
            }
            if (data.format == 1) {
              playerPointsText = '';
            } else {
              playerPointsText = player.points + 'pts';
            }
            detail += `<div class="player">${playerNameText}<div class="points">${playerPointsText}</div></div>`
          }
          text += `<div class="team" id="${rankEng}"><div class="team_head" id=${rankEng}><div class="rank">${rank}</div><div class="tag">${tag}</div><div class="sum">${sum}pts</div></div></div>${detail}</div>`;
        }
        $('div#finals_table').html(text)
      }
    })
  })
});