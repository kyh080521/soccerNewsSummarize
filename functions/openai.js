import OpenAI from "openai";
import { getNewsContent } from "./articleCrawl.js";

const client = new OpenAI();

const howTransferPro = (input) => {
    var playerInfo = {};
    const result = {};

    var PlayerInfo = function createPlayerInfo() {
        this.r = 0;
        this.n = 0;
        this.d = 0
    }

    for (let i = 0; i < input.length; i++) {
        var clubName = input[i][0].trim();
        clubName = clubName.replace(/^'|'$/g, '');
        const state = input[i][1].trim();

        if (!Object.keys(playerInfo).includes(clubName))
            playerInfo[clubName] = new PlayerInfo();
        playerInfo[clubName][state]++;
    }

    for (const key of Object.keys(playerInfo)) {
        var r = playerInfo[key].r;
        var n = playerInfo[key].n;
        var d = playerInfo[key].d;

        if (r > n && r > d) result[key] = "Roumour"
        else if (n > d && n > r) result[key] = "Negotiation"
        else if (d > n && d > r) result[key] = "Here We Go(done deal)"
        else result[key] = "Mixed Signals"
    }

    return result;

}

async function isTransferNews(input) {
    const messages = [
        { role: "system", content: "당신은 축구 선수의 이적 현황을 업데이트 해 주는 축구 기자의 비서입니다. 뉴스 기사의 제목을 읽고 이 뉴스가 이적 상황 진척에 관한 뉴스라면 true를 아니라면 false를 출력해야 합니다." },

        { role: "user", content: "Cunha completes 'dream' £62.5m Man Utd move" },
        { role: "assistant", content: "true" },

        { role: "user", content: "Spurs captain Son says Postecoglou a club 'legend'onvert 100 Celsius to Fahrenheit." },
        { role: "assistant", content: "false" },

        { role: "user", content: "'Creativity, movement and sharp finishing' - what will Son bring?" },
        { role: "assistant", content: "false" },

        { role: "user", content: "Isak? Sesko? Gyokeres? Inside Arsenal's summer plans" },
        { role: "assistant", content: "true" },

        { role: "user", content: "'It's a big gamble' - fans on potentially losing Ait-Nouri as well as Cunh" },
        { role: "assistant", content: "false" },

        { role: "user", content: input }
    ];

    const response = await client.responses.create({
        model: "gpt-4.1",
        input: messages
    });

    //console.log(response.output_text);
    return response.output_text
}

async function newsContent(input) {
    const messages = [
        { role: "system", content: "당신의 역할을 기사를 읽고 이 선수가 현재 어떤 팀과 어느 정도로 이적설이 진행되었는지 판단하는 것입니다. 만약 선수가 어떤 팀과 링크가 나고 있지 않다면 false를 반환하십시오. 아니라면 출력값은 ','로 구분되어진 두 개의 값입니다. 첫 번째 변수는 해당 축구팀의 정식 명칭이 들어가야 합니다. 두번째 변수에는 현재 이적 상황에 따라 구단이 선수에 대한 관심 표명 단계라면 'r', 양측 간 협상이 시작되었다면 'n', 이적이 성사되었다면 'd'가 들어가야 합니다." },

        { role: "user", content: "Alex, London: How much truth is there to the rumours Bukayo Saka is now unsettled at Arsenal and where do you think he will go? Madrid? City? Maybe even Newcastle? Alex Howell: I don't think there is any truth to that. Speaking about his future before the Champions League quarter-final with Real Madrid he said: I want to win and I want to win wearing this badge so I think it's pretty clear." },
        { role: "assistant", content: "false" },

        { role: "user", content: "Manchester United have agreed a deal with Wolves for the signing of Brazil forward Matheus Cunha. The 26-year-old is set to become United's first signing of the summer after the club activated a £62.5m release clause in Cunha's Wolves contract." },
        { role: "assistant", content: "Manchester United , d" },

        { role: "user", content: "Arsenal have agreed a fee of about £59m with Real Sociedad for Spain midfielder Martin Zubimendi, 26, with the move to be completed after 1 July to help with meeting Financial Fair Play (FFP) regulations." },
        { role: "assistant", content: "Arsenal , n" },

        { role: "user", content: "At the top of Arteta's wishlist is Newcastle frontman Isak, and a move for the Sweden international has almost universal backing from those behind the scenes at Emirates Stadium." },
        { role: "assistant", content: "Arsenal , r" },

        { role: "user", content: input }
    ];

    const response = await client.responses.create({
        model: "gpt-4o-mini",
        input: messages
    });

    return response.output_text;
}

export async function newsSummarize(input) {
    const contents = [];

    for (const [title, url] of input) {
        const transfernews = await isTransferNews(title);
        if (transfernews === "true") {

            const content = await getNewsContent(url);
            const summarize = await newsContent(content);

            if (summarize !== 'false')
                contents.push(summarize.split(","));

        }
    }

    const result = howTransferPro(contents)
    //console.log(result)
    return result;
}

export async function wikiSummarize(input) {
    const response = await client.responses.create({
        model: "gpt-4o-mini",
        temperature: 0.2,
        instructions: "당신은 비서입니다. 당신에게 오는 뉴스 기사문을 한 문장으로 요약해 주십시오.",
        input: input
    });

    console.log(response);
    return (response.output_text);
};
