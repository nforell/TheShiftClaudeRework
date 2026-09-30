/* Day shift, 3 East. Stories for Daniel, Jasmine, Bob, Miguel and Linda. */
(function (S) {
  S.story.add('psych-3e-1', {
    '301': {
      gate: (s, P) => P.disclosed && P.oneToOne,
      idle: ['dan_safe'],
      guarded: [`"I'm okay. I just don't have a lot of words right now."`, `He's lying on his side, facing the wall. "Can we do this later?"`],
      presence: `You sit by the door. The float is shuffling his cards in the hall. After a while Daniel says, "You don't have to stay." You stay. A few minutes later: "...Thanks."`,
      beats: [
        { need: 0, learn: `Sound engineer. Keeps a folder of recordings of his daughter Mia laughing.`,
          text: `"I record sound for a living. Documentaries, mostly. Birds, rain, a factory in Ohio." He turns his hands over. "I have a folder on my laptop that's just Mia laughing. Six years of it. I used to play it when I was editing, to reset my ears."`,
          choices: [
            { label: `What does her laugh sound like?`, rap: 1, reply: `He thinks about it like an engineer. "It starts high and falls down the stairs. Then she snorts, and that makes her laugh harder." The corner of his mouth moves. "Best sound I ever recorded."` },
            { label: `That's a lovely thing to have saved.`, rap: 0, reply: `"Yeah." He nods. You can tell he hasn't opened it in a while.` },
            { label: `Think about Mia. She needs her dad.`, rap: -1, reply: `His face closes. "I know what she needs. That's the whole problem." He turns toward the wall.` },
          ] },
        { need: 1, learn: `His sister Grace found him on Tuesday. She broke the back window to get in.`,
          text: `"Grace found me Tuesday. She had a feeling, drove over, broke the back window with a flowerpot." He looks at his knuckles. "She cut her arm on the glass. Eleven stitches. I keep thinking about her sitting in the ED with a towel around her arm while they worked on me."`,
          choices: [
            { label: `That sounds like a lot to carry, knowing she was hurt too. What is it like to think about?`, rap: 1, reply: `"Like I owe her something I can't pay back." A long breath. "She texted me this morning. Just a heart. She never sends emojis. She thinks they're stupid."` },
            { label: `She must love you a lot.`, rap: 0, reply: `"Yeah." He says it like it hurts. Maybe it does.` },
            { label: `You're lucky she got there in time.`, rap: -1, reply: `"People keep saying 'lucky.'" His voice is flat. "Tuesday I didn't feel lucky."` },
          ] },
        { need: 2, learn: `His reasons to live: Mia, Grace, and the bees. He wants to finish a film about a beekeeper.`,
          text: `He's holding a pencil and a piece of paper from the group room. At the top, in block letters: REASONS. "Andre said to write some down for the safety plan. I've got two. Mia. Grace." He taps the empty third line. "It feels stupid to write a third one."`,
          choices: [
            { label: `It isn't stupid. Is there something you'd want to be here for, even a small thing?`, rap: 1, set: { reasons: true },
              judge: [`comm`, 1, `You helped Daniel name his reasons for living.`, `Reasons for living are part of a safety plan, in his words and his handwriting. You didn't argue him out of the pain. You helped him find what's already holding him.`],
              reply: `He's quiet for a long time. Then: "There's a beekeeper in Petaluma. Eighty-one. I've been recording her hives for two years. The film's not done." He writes THE BEES on the third line and underlines it twice. "She'd be so annoyed if I didn't finish it."` },
            { label: `Two is a good start. You can add more later.`, rap: 0, reply: `"Okay." He sets the paper down. The third line stays empty.` },
            { label: `You have so much to live for. Your whole life's ahead of you.`, rap: -1, reply: `"Sure." He folds the paper in half. You've told him how he should feel, and he's heard that one a lot.` },
          ] },
        { need: 3, learn: `Called Grace. Asked her to bring the nine-legged bee Mia drew for him.`,
          text: `He's off the phone. His eyes are red, but his shoulders are down. "I called Grace. I told her the truth, what I had planned for tonight. She didn't yell. She just cried and said 'okay, okay.'" He almost smiles. "I asked her to bring the drawing on my fridge. Mia drew me a bee. It has nine legs. She says the extra one is for holding hands."`,
          choices: [
            { label: `That took courage. How do you feel now?`, rap: 1, reply: `"Tired. Like after a long session." He rubs his eyes. "But it's a different tired. The other kind felt like the end of something. This feels like the middle."` },
            { label: `A bee holding hands. I love that.`, rap: 1, reply: `"Right? Biologically inaccurate. Emotionally correct." He laughs, a real one, and then looks surprised at himself.` },
            { label: `See? Things are already getting better.`, rap: 0, reply: `"Maybe." He's careful with the word. He doesn't want to promise too much yet.` },
          ] },
      ],
      epi: {
        close: (s, P) => (P.reported
          ? `Daniel stayed three weeks. Grace came every day and brought the nine-legged bee, which lived taped above his bed. Eleven months later a documentary about an 81-year-old beekeeper played at a small festival. The last line of the credits read: "Thank you to the day staff of 3 East, who asked me the real question."`
          : `Daniel's hold ended at 14:00. The psychiatrist never heard the whole story, so he went home with Grace. ${P.reasons ? 'He took the paper that said REASONS. Grace taped it to the fridge, next to the nine-legged bee.' : 'He took the nine-legged bee with him.'} He called the crisis line twice that month. Both times, he says, someone picked up. He's still here.`),
        warm: (s, P) => (P.reported
          ? `Daniel stayed on the unit for two more weeks and started a new medication. Grace drove him home. He goes to therapy on Thursdays. He's still editing the bee film, a little at a time.`
          : `Daniel went home at 14:00 when his hold ended. Grace drove him and stayed the week. He's on a waitlist for a therapist. The team never learned how close tonight had been.`),
        distant: (s, P) => (P.reported
          ? `Daniel was certified and stayed on. He didn't talk much to the day staff. His chart says he's "participating in groups," which is true, and not the whole story.`
          : `Daniel's hold ended at 14:00 and he walked out calm, his bag already packed. Nobody on the team knew what he'd planned for tonight.`),
        hard: (s, P) => (P.attempt
          ? `Daniel survived. He went to the ED, then back to 3 East on a longer hold. Grace was there when he woke up. She asked the nurses one thing: "Is anybody talking to him?"`
          : `Daniel walked out at 14:00, calm and smiling, with a plan nobody had found. Grace was waiting in the parking lot. What happens next isn't in any chart. The warning signs were there by 08:00.`),
      },
    },

    '303': {
      after: ['jas_chat'],
      guarded: [`"I'm BUSY." She doesn't look up from the sketchbook.`, `"Not now, not now, I'm in the middle of a thought, it's a good one."`],
      presence: `You sit at the dayroom table. She keeps drawing, fast. After ten minutes she tears out a page and slides it over: it's you, sitting there, a little tired. It's really good. "You looked like you needed a portrait," she says.`,
      beats: [
        { need: 0, learn: `DJ and designer. Draws album covers; her favorite is a woman made of sound waves.`,
          text: `She flips the sketchbook around. Every page is covered: faces, speakers, a woman whose hair turns into sound waves that turn into birds. "I do album covers. And I DJ Fridays at a place called Low Tide." She taps the sound-wave woman. "This one's for my own record. When I make one."`,
          choices: [
            { label: `She's incredible. What's the record about?`, rap: 1, reply: `She slows down for the first time today. "Being too much. People always say I'm too much." She traces the birds. "I wanted to make too much sound beautiful."` },
            { label: `You're really talented.`, rap: 0, reply: `"I KNOW, right?" And she's off again, flipping pages faster than you can look.` },
            { label: `These are nice, but let's focus on getting you calm.`, rap: -1, reply: `She snaps the book shut. "Right. Calm. Everybody wants me calm."` },
          ] },
        { need: 1, learn: `Stopped her lithium because it made her feel "beige." She wants to talk to Dr. Iyer about it.`,
          text: `"You want to know why I stopped the lithium? Everybody asks like I'm stupid." She sits, which is new. "On it, I'm beige. I can't draw. Colors look like colors instead of feelings. I missed being ME." Her knee bounces. "Right now I feel like me times a thousand. I know that's not great either."`,
          choices: [
            { label: `Losing what makes you you is a real cost. Would you want to tell Dr. Iyer that, in those words? There may be other options or doses that feel less beige.`, rap: 1, set: { beige: true },
              judge: [`comm`, 1, `You asked Jasmine why she stopped her lithium, and helped her take it to her psychiatrist.`, `People stop mood stabilizers for real reasons: numbness, weight, feeling flat. Naming the reason is how the team finds a plan she'll actually stay on.`],
              reply: `She stares at you. "Beige. I'm going to say beige." She writes BEIGE on her hand in purple marker. "Nobody ever asked me what it felt like. They just asked if I was taking it."` },
            { label: `The lithium keeps you safe, though.`, rap: 0, reply: `"Yeah, yeah." She's heard it. She's back on her feet.` },
            { label: `Feeling like "you" is how you ended up here.`, rap: -1, reply: `It lands like a slap. "Wow." She walks away. You were right about the facts and wrong about everything else.` },
          ] },
        { need: 2, learn: `Scared about the wall she punched, the rent money she spent, and her mom finding out.`,
          text: `It's quieter now, and she's quieter too. "I punched a wall last week. At my mom's." She holds up her hand. "And I spent my rent on speakers. Like, all of it." She presses her palms into her eyes. "When this wears off I'm going to remember everything. That's the worst part. You remember everything."`,
          choices: [
            { label: `That's a lot to face. You don't have to face it alone. Social work can help with the rent, and when you're ready, we can think about how to talk with your mom.`, rap: 1, reply: `"Social work can do rent?" She wipes her face on her sleeve. "Okay. Okay. My mom's gonna cry. She always cries. But she always comes."` },
            { label: `Try not to worry about that now.`, rap: 0, reply: `"Easy for you to say." But she doesn't leave.` },
            { label: `Well, the next few weeks will be about consequences.`, rap: -1, reply: `She pulls her knees up to her chest and doesn't say anything else.` },
          ] },
      ],
      epi: {
        close: `Jasmine and Dr. Iyer changed her dose and added a second medication she says is "only a little beige." She stayed on it. Six months later, 3 East got an envelope with no letter: just a print of the sound-wave woman. In the corner, in purple, it said "not too much."`,
        warm: `Jasmine went home after two weeks. Her mom picked her up, and cried, and came. She's back DJing on Fridays.`,
        distant: `Jasmine was discharged after two weeks. She said the staff "were fine." She stopped the lithium again in the spring.`,
        hard: `It was a long admission for Jasmine. She left angry at nearly everyone on 3 East, and at herself. Her mom kept the sketchbook safe for her until she was ready to open it again.`,
      },
    },

    '305': {
      watch: true,
      idle: ['bob_after'],
      guarded: [`"Just gonna rest my eyes, kid."`, `He's holding the emesis basin in his lap. "Maybe later."`],
      presence: `You sit with him. He shakes less when he isn't trying so hard to hold still. "Ruth always sits on the left," he says. "You're on the right. It's weird." You move. He laughs.`,
      beats: [
        { need: 0, learn: `Carried mail for 26 years. His favorite thing was delivering a thick envelope: good news.`,
          text: `"Twenty-six years carrying mail. Same route, Elm to Birch." He holds up a shaky hand and smiles at it. "Best thing was a thick envelope in May. College acceptance. Thin ones are rejections. I'd see a kid waiting on the porch and I'd know before they did."`,
          choices: [
            { label: `What did you do when it was a thin one?`, rap: 1, reply: `"Handed it over, said 'their loss,' and walked slow so they didn't feel watched." He nods to himself. "You don't just drop it and run. It's somebody's whole day."` },
            { label: `That's a great job to have had.`, rap: 0, reply: `"It was a good one." He closes his eyes, still smiling a little.` },
            { label: `Let's focus on getting your levels down.`, rap: -1, reply: `"Right. Sure." He goes quiet. Most people probably do only ask about his levels.` },
          ] },
        { need: 1, learn: `Before lithium, he lost most of a year. He calls that man "not me."`,
          text: `"People think I'm a nuisance about the lithium. Twenty years." He's looking at the ceiling. "Before it, I lost a year. 2005. I don't remember most of it. Ruth does. She says I painted the whole house at three in the morning and then couldn't get out of bed until Easter." He swallows. "That wasn't me. The lithium gave me back."`,
          choices: [
            { label: `So the lithium feels like part of what keeps you yourself. That's why this has been so scary.`, rap: 1, reply: `"Yeah." It comes out rough. "Today I thought, what if they take it away? What if I lose another year?" He looks at you. "They're not going to take it away, right? Just fix it?"` },
            { label: `We'll get the dose right, and you'll be back on track.`, rap: 0, reply: `"Hope so." He grips the basin a little tighter.` },
            { label: `Well, that's why you have to watch the water pills.`, rap: -1, reply: `"I didn't KNOW about the water pills." He's hurt. "Nobody told me."` },
          ] },
        { need: 2, learn: `Builds a birdhouse for every grandchild. Number five, a yellow house with blue shutters, is due in March.`,
          text: `He shows you a photo: a row of birdhouses on a fence, each a different color. "One for every grandkid. The red one's Tyler's, the green one's the twins'." He zooms in on an empty post. "Number five is due in March. My daughter wants a yellow house with blue shutters." He looks at his hands. "Hard to cut a straight line like this."`,
          choices: [
            { label: `When your level's back to normal, this tremor should settle. March is a long way off. You'll have steady hands for those shutters.`, rap: 1, reply: `He looks at his hands like he's seeing them fresh. "Steady for the shutters." He tucks the phone in his pocket. "Okay. I'll drink the water. I'll drink ALL the water."` },
            { label: `Yellow and blue. That'll be beautiful.`, rap: 1, reply: `"It will." He smiles for real now. "I already bought the paint."` },
            { label: `Maybe someone else could build this one.`, rap: -1, reply: `"No." He says it quietly, and that's the end of it.` },
          ] },
      ],
      epi: {
        close: `Bob's lithium level came down over two days, and his cardiologist switched the water pill. He went home steady. In March, 3 East got a photo: a yellow birdhouse with blue shutters, and a baby in a car seat underneath it. On the back: "Straight lines. Thanks, kid. — Bob."`,
        warm: `Bob's level came down and he went home with a new blood pressure pill. Ruth made him put a list on the fridge: no Motrin, call first.`,
        distant: `Bob went home after his level normalized. He still isn't sure which of his pills caused all this.`,
        hard: `Bob went to medicine for a monitored correction. He was very sick for several days. When he got back to baseline, the first thing he asked Ruth was whether it was still possible to finish the birdhouse by March.`,
      },
    },

    '307': {
      gate: (s, P) => P.trust >= 1,
      after: ['mig_warm'], idle: ['mig_after'],
      guarded: [`He watches you from the bed, hood half up. "...Not now."`, `"I'm thinking." He doesn't explain what about.`],
      presence: `You sit at the far end of the room, not too close. He watches you for a while. Then he slides a sealed juice box across the floor to you, the kind he checks. An offering. You don't open it until he nods.`,
      beats: [
        { need: 0, learn: `Civil engineering student who loves bridges. "They bend so they don't break."`,
          text: `He's drawing on a napkin: a bridge, with long curving cables. "Suspension bridge. People think bridges are stiff. They're not. They're built to move. They bend so they don't break." He doesn't look up. "My dad built things. Moved back to Guadalajara two years ago. I used to send him my drawings."`,
          choices: [
            { label: `Bend so they don't break. Tell me more about how that works.`, rap: 1, reply: `And for five whole minutes, Miguel explains tension and load to you, clearly and patiently. He's a good teacher. He forgets to watch the door.` },
            { label: `You miss your dad.`, rap: 0, reply: `He shrugs, which could mean anything. He keeps drawing.` },
            { label: `That's good. Keep your mind busy.`, rap: -1, reply: `"My mind IS busy." He crumples the napkin.` },
          ] },
        { need: 1, learn: `Deep down he's afraid something is wrong with his mind, not just with the food.`,
          text: `It comes out quietly, like he's been holding it. "Sometimes I think... what if it's not them. What if it's me? What if something's wrong in here." He touches his temple. "That's scarier. If it's them, I can check the seals. If it's me, I can't check anything."`,
          choices: [
            { label: `That sounds really frightening, not being sure what to trust. I'm glad you told me. You don't have to figure it out alone. We can take it one piece at a time.`, rap: 1,
              judge: [`comm`, 1, `You stayed with Miguel's fear instead of arguing with it.`, `This is insight trying to come in. Pushing a label on him now ("see, it's the illness") can slam that door. Staying calm with the uncertainty lets him keep it open.`],
              reply: `He breathes out. "One piece." He nods a few times. "Okay. Today the piece is the pill. Tomorrow maybe something else."` },
            { label: `It's probably a little of both.`, rap: 0, reply: `"Both." He turns the word over. He doesn't look comforted.` },
            { label: `The voices aren't real, Miguel. It's the illness.`, rap: -1,
              judge: [`comm`, -1, `You told Miguel his voices weren't real.`, `To him, they're as real as your voice. Arguing with a psychotic experience rarely works and can cost you his trust. Respond to the fear instead.`],
              reply: `His face shuts like a door. "You sound like the ED doctor." He pulls his hood back up.` },
          ] },
        { need: 2, learn: `First in his family to go to college. Calls this hospital stay a "detour."`,
          text: `"I'm the first one in my family to go to college. My mom cleaned offices at the university for twelve years. Now I have classes in one of the buildings she cleaned." He picks at the hem of his sweatshirt. "I missed my midterms. Is this... is my whole life over?"`,
          choices: [
            { label: `No. Lots of students come back after a hospital stay. This is a detour, not the end of the road. The school has people who can help you take a leave and return.`, rap: 1, reply: `"A detour." He tries it out. "Bridges have detours when they're getting fixed." He almost smiles. "They're still bridges."` },
            { label: `Let's just focus on today.`, rap: 0, reply: `"Yeah." He nods, but his eyes are far away.` },
            { label: `School can wait. Your health comes first.`, rap: 0, reply: `"School is my health." He goes quiet.` },
          ] },
      ],
      epi: {
        close: `Miguel took his risperidone, from a blister pack he opened himself, every day. It took about three weeks for the vent to go silent. He went back to school the next fall part-time. His first project was a pedestrian bridge. He mailed the drawing to his dad, and a copy to 3 East.`,
        warm: `Miguel started eating off the regular tray after a week, and went home with his mom and a plan for school. He calls the stay "the detour."`,
        distant: `Miguel was stabilized and discharged after a few weeks. He doesn't talk about his time on 3 East. He's back in class.`,
        hard: `Miguel's stay was long and frightening. For days, Ana brought arroz con pollo every afternoon, and he ate it. It was the only thing he trusted. It was enough to hold on to until the rest of the treatment caught up.`,
      },
    },

    '309': {
      idle: ['lin_after'],
      guarded: [`"Shh. This is a good song."`, `She hums and doesn't look at you. "The committee's in session."`],
      presence: `You sit. The oldies station plays Martha and the Vandellas. Linda taps along on the table. When the song ends, she says, "You have good taste in silence." You'll take it.`,
      beats: [
        { need: 0, learn: `Her mama played the Supremes every Sunday. Her favorite is "Someday We'll Be Together."`,
          text: `A song comes on the radio and she turns it up. "Mama saw the Supremes live when she was sixteen. She never got over it. Every Sunday she'd put the record on while she cooked." She sways. "'Someday We'll Be Together.' That was hers. Now it's mine."`,
          choices: [
            { label: `What do you remember about your mama?`, rap: 1, reply: `She smiles, and for a moment she's very clear. "She sang in the kitchen. Loud. She'd point the spoon at you on the high notes." She points an imaginary spoon at you. You laugh. So does she.` },
            { label: `That's a great song.`, rap: 0, reply: `"It IS." She turns it up a little more.` },
            { label: `Can we turn this down so we can talk?`, rap: -1, reply: `She turns it down, and her face turns down with it.` },
          ] },
        { need: 1, learn: `Worked as a bank teller for years. Her drawer always balanced to the penny.`,
          text: `"I was a bank teller. Before." She lines up her cups on the windowsill, very neatly. "First National, on Grand. My drawer balanced to the penny every day for eleven years. Mr. Hoyt said I was the best he ever had." A pause. "Then the committee started talking during the counting."`,
          choices: [
            { label: `Eleven years to the penny. That takes real focus. What was that job like for you?`, rap: 1, reply: `"Quiet. Orderly. Everything added up." She looks at the cups. "Nothing adds up in my head anymore. But out here, it can." She straightens the last one.` },
            { label: `You must miss it.`, rap: 0, reply: `She nods and doesn't say more.` },
            { label: `Maybe someday you could work again.`, rap: 0, reply: `"Maybe." She's heard it before. It's not a no.` },
          ] },
        { need: 2, learn: `The water feels like it "washes out" the committee. Spearmint gum and ice chips help her resist.`,
          text: `She speaks very quietly, like the committee might hear. "Do you know why I drink the water? It washes them out. For a minute, it's quiet in there." She looks at the pitcher on the desk with its lines for each hour. "When you took the sink, they got louder."`,
          choices: [
            { label: `So the water is how you quiet them. That makes sense. Could we try some other things that might help, like spearmint gum, ice chips from your allowance, or the radio up during the hard times?`, rap: 1, set: { linCoping: true },
              judge: [`comm`, 1, `You asked Linda what the water does for her and offered other ways to cope.`, `Polydipsia often has a purpose for the patient. Restricting fluid without replacing what it does leaves her alone with the voices. Offering substitutes makes the plan something she can live with.`],
              reply: `She thinks about it seriously, like it's a business proposal. "Spearmint. The committee hates mint." A small, sly smile. "I'll try the gum."` },
            { label: `The water is dangerous for you, Linda.`, rap: 0, reply: `"I know. I know." She rubs her temples.` },
            { label: `The voices aren't real. The water won't do anything.`, rap: -1, reply: `"They're real to ME." She turns the radio up loud and doesn't look at you again.` },
          ] },
      ],
      epi: {
        close: `Linda's sodium came back to normal over three days. She went back to her board-and-care with a bag of spearmint gum and a new rule she made herself: one song, then one cup. Her conservator reports that she now balances the house's grocery money to the penny. She hums "Someday We'll Be Together" while she does it.`,
        warm: `Linda's sodium recovered and she went home to her board-and-care. The staff there keep a pitcher with hourly lines on it. She calls it "the ledger."`,
        distant: `Linda's sodium recovered and she was discharged. The plan went home with her. Whether she follows it depends a lot on the committee.`,
        hard: `Linda went to medicine for a slow, monitored correction. She was confused for two days and scared. A nurse there found the oldies station for her. It helped more than anyone expected.`,
      },
    },
  });
})(window.Shift);
