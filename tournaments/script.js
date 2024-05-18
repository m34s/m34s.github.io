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
      const rankIdList = ['0', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth']
      const enRankList = ['0', '🥇', '🥈', '🥉', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
      const jaRankList = ['0', '優勝', '準優勝', '3位', '4位', '5位', '6位', '7位', '8位', '9位', '10位', '11位', '12位'];
      const getPlayerName = (array, plyrId) => {
        try {
          return array.find(({ id }) => id === plyrId).name;
        } catch (e) {
          console.log(e.messsage);
          return undefined;
        }
      }
      const tnmId = getP(param, 'id');
      const index = tnm.findIndex(({ id }) => id === tnmId);
      if (index === -1) {
        let htmlText = '';
        for (let i in tnm) {
          const date = tnm[i].date.split('-');
          const dateText = Number(date[1]) + '/' + Number(date[2]);
          const title = tnm[i].title.replace('MKCentral ', '');
          let winners = [];
          for (let j in tnm[i].winners) {
            winners.push(getPlayerName(plyr, tnm[i].winners[j]));
          }
          htmlText += `<div class="tournament-block"><div class="tournament-title"><a href="index.html?id=${tnm[i].id}">${title} - ${dateText}</a></div></div>`
        }
        htmlText += `<p>・歴代優勝者一覧は<a href="https://docs.google.com/spreadsheets/d/1O3X3ssAhfyv43qutWwmBHZzn6Ggi8w74PDdCdTPeyQ8/edit#gid=0" target="_blank" rel="noopener noreferrer">こちら</a></p>`
        $('h2#title').html('決勝結果一覧');
        $('div#list').html(htmlText);
      } else {
        const data = tnm[index];
        console.log(data);
        const title = data.title;
        const host = data.host;
        const formatList = ['', '個人(FFA)', 'タッグ(2v2)', 'トリプルス(3v3)', 'フォーマンセル(4v4)', '', 'チーム(6v6)']
        const format = formatList[data.format];
        const [year, month, day] = data.date.split('-');
        const date = `${year}年${month}月${day}日`
        const url = data.url;
        document.title = title + ' 大会結果 | そらまめ【MK8DX大会まとめ】'
        $('h2#title').html(title + ' 決勝結果');
        $('div#comment').html(`<p>主催は${host}、形式は${format}、決勝日は${date}。</p><p>→<a href="${url}" target="_blank" rel="noopener noreferrer">大会サイト</a></p>`)

        let finalsTableText = '';
        $.getJSON(`/json/finals/${tnmId}.json`, function (tnmDetail) {
          for (let i in tnmDetail.finals) {
            const teamData = tnmDetail.finals[i];
            const tag = teamData.tag;
            const tPoints = teamData.points;
            let tPointsText = '';
            if (data.format !== 1) {
              tPointsText = `<span>(${tPoints} pts)</span>`;
            }
            const tRank = teamData.rank;
            let playerText = ''
            for (let j in teamData.player) {
              const playerData = teamData.player[j];
              const pId = playerData.id;
              const pPoints = playerData.points;
              const pRank = playerData.rank;
              let pName = getPlayerName(plyr, pId);
              if (pName) {
                pName = `<a href="/players/?id=${pId}">${pName}</a>`;
              } else {
                pName = '##';
              } 
              if (data.format == 1) {
                playerText += `<div class="ffa-player-block"><span class="name">${pName}</span><span class="points">${pPoints}</span></div>`
              } else {
                playerText += `<div class="player-block"><span class="name">${pName}</span><span class="points">${pPoints}</span><span class="rank">${enRankList[pRank]}</span></div>`
              }
              
            }
            let ffa = '';
            if (data.format == 1) { ffa = 'ffa-' };
            finalsTableText += `<div class="team-result" id="${rankIdList[tRank]}"><div class="team-rank"><span>${jaRankList[tRank]}</span></div><div class="${ffa}tag"><span>${tag}</span>${tPointsText}</div><div class="player-result">${playerText}</div></div>`;
          }
          $('div#finals-table').html(finalsTableText)
        })
        
      }
    })
  })
});
