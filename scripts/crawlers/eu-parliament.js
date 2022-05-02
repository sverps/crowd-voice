const Crawler = require("crawler");
const fs = require("fs");

async function main() {
  const members = [];

  const c = new Crawler({
    rateLimit: 100,
    // maxConnections: 10,
    // This will be called for each crawled page
    callback: function (error, res, done) {
      console.log("Processing...", members.length);
      if (error) {
        console.log(error);
      } else {
        const $ = res.$;
        const member = {
          id: res.request.uri.href.split("/").slice(-3, -2)[0],
          url: res.request.uri.href,
          committees: [],
        };
        const name = $("span.sln-member-name").text();
        const matchIndex = /[A-Z]{2}/.exec(name)?.index;
        member.firstName = name.substring(0, matchIndex - 1);
        member.lastName = name.substring(matchIndex);
        member.email = $("a.link_email")
          .attr("href")
          .substring(7)
          .replace("[dot]", ".")
          .replace("[at]", "@")
          .split("")
          .reverse()
          .join("");
        member.group = $("#presentationmep h3.erpl_title-h3").text();
        member.country = $("#presentationmep div.erpl_title-h3")
          .text()
          .split(" - ")[0]
          .trim();
        member.party = $("#presentationmep div.erpl_title-h3")
          .text()
          .split(" - ")[1]
          .split("(")[0]
          .trim();
        $("div.erpl_meps-status").each(function (index) {
          const position = $(this).children("h4.erpl_title-h4").text();
          const committees = [];
          $(this)
            .children(".badges")
            .children("div.erpl_committee")
            .each(function (committeeIndex) {
              committees[committeeIndex] = $(this).text();
            });
          member.committees = [
            ...member.committees,
            ...committees.map((committee) => ({ committee, position })),
          ];
        });
        members.push(member);
      }
      done();
    },
  });

  c.queue({
    uri: "https://www.europarl.europa.eu/meps/en/full-list/all",
    callback: function (error, res, done) {
      if (error) {
        console.log(error);
      } else {
        const $ = res.$;
        const meps = new Array();
        $('[id*="member-block-"]').each(function (index) {
          meps[index] = $(this).attr("id").substring(13);
        });
        meps.forEach((mepId) => {
          c.queue(`https://www.europarl.europa.eu/meps/en/${mepId}`);
        });
      }
      done();
    },
  });

  return await new Promise((resolve, reject) => {
    c.on("drain", function () {
      fs.writeFileSync(
        "./src/data/contacts.json",
        JSON.stringify(members, null, 2)
      );
      resolve(`Wrote ${members.length} members to ./src/data/contacts.json`);
    });
  });
}

main().then(console.log).catch(console.error);
