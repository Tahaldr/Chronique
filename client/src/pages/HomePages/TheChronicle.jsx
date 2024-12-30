import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const TheChronicle = ({ activeCategory }) => {
  const [sidebarTop, setSidebarTop] = useState(null);
  const sidebar = document.getElementById("sidebar");

  useEffect(() => {
    const handleScroll = () => {
      if (sidebar) {
        setSidebarTop(sidebar.getBoundingClientRect().top);
      }
    };
    document.addEventListener("scroll", handleScroll);

    return () => document.removeEventListener("scroll", handleScroll);
  }, [sidebar]);

  return (
    <div className="flex">
      {/* Change the h-screen to h-full later */}
      <div className="h-full w-2/3">
        <div className="bg-yellow-400 w-full h-full">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facilis
          similique assumenda ad fugit sunt ipsum laboriosam, blanditiis et
          mollitia rerum sapiente perferendis enim sed dolores. Nulla optio, non
          autem hic, commodi provident illum culpa aliquam ipsam necessitatibus,
          voluptatibus suscipit veniam animi blanditiis eum! Laborum ipsam
          doloribus vitae a excepturi voluptate repudiandae ad earum laboriosam
          corporis? Odio labore distinctio optio iure impedit! Quas rem
          explicabo nam fugit. Ipsa aut quas blanditiis sequi iusto saepe! Sed
          recusandae sapiente minima repellendus animi ipsum tenetur cupiditate
          id alias deserunt beatae ratione porro, distinctio nulla tempore optio
          similique nesciunt adipisci rerum, unde dolor veniam. Animi, expedita
          tempora? Nihil vitae, amet beatae magni expedita, non harum nesciunt
          laboriosam, ipsam nemo enim quo! Magnam consequatur placeat minus
          illo, ut vitae dolorum animi natus fugiat sint laudantium numquam et
          assumenda! Aperiam architecto maxime distinctio consectetur nobis ad
          fugiat aliquam itaque rerum animi aut ducimus minima, dolores,
          similique accusamus nam nesciunt exercitationem. Quae odit eum porro
          deleniti debitis quidem a optio iusto sapiente nihil quaerat sint
          animi beatae deserunt corporis eligendi nisi laboriosam facere fuga,
          eveniet consequatur iure perspiciatis veniam dolorem. Voluptatem,
          suscipit, maiores blanditiis voluptas nulla reiciendis corrupti
          assumenda ratione nobis nemo possimus odit ex, sed eum reprehenderit
          deleniti fugiat modi quibusdam similique repellat laudantium qui
          perspiciatis exercitationem! Provident quibusdam id earum fuga
          voluptates autem quae, temporibus ipsa commodi, minima nihil aliquid
          tempora officia praesentium harum eius ut repellat cum aut, magnam
          vel. Architecto asperiores reiciendis quae mollitia repellendus
          ratione aliquam numquam corporis quas, maxime, delectus amet
          veritatis? Ullam veniam sed, nam quaerat quibusdam velit fugit
          temporibus, atque eius quia nulla. Quibusdam laudantium nemo
          temporibus, laborum amet distinctio aut sequi odit nihil dolorem sunt
          perferendis libero, sapiente commodi, culpa eaque placeat blanditiis
          repellat asperiores voluptate soluta! Labore repellat tenetur hic. Qui
          beatae laboriosam nihil eos consectetur autem, quaerat at labore,
          molestias aspernatur culpa cumque ducimus. Quo odio eaque corrupti sit
          ab est, veniam praesentium ad explicabo beatae dolores deleniti
          possimus illum quod officia, ipsam quia corporis autem consequatur
          animi perferendis id! Ex nostrum ut suscipit quas, ipsam, earum
          perferendis pariatur ab cupiditate, corrupti totam impedit obcaecati.
          Ipsam asperiores, hic autem recusandae ipsum natus eos praesentium
          maxime dicta vero accusamus quo animi sint ex, possimus quae iure ea
          voluptatibus incidunt, laboriosam quasi iste blanditiis optio
          suscipit. Fuga sint distinctio numquam temporibus dolore nesciunt
          illum illo cumque ipsam nam repudiandae officia nisi deleniti rem ea
          iusto hic, non amet possimus est explicabo enim doloribus laborum
          quibusdam. A molestiae debitis aperiam modi odit voluptate laudantium
          libero delectus, error at voluptatibus ratione iusto, ipsum voluptatem
          suscipit, eveniet maiores sunt placeat. Provident sint, suscipit ipsa
          laborum nisi recusandae sit delectus voluptatibus corrupti. Aliquam
          corporis corrupti ipsum similique dicta, voluptate expedita. Provident
          hic voluptate aliquam aspernatur quia, reiciendis perferendis nesciunt
          excepturi nemo id aliquid quae accusamus. Animi eos et molestiae
          reiciendis. Labore a omnis, unde nam facilis exercitationem enim
          laboriosam expedita, libero ad maxime eos, modi dolor amet. Aliquam
          rerum inventore suscipit dolorum pariatur sit odio, autem nulla est
          nostrum animi mollitia et dolorem nobis voluptate, minima itaque, at
          maxime adipisci eligendi. Quidem quos facere sequi, nam quasi dolore
          tempore quam eum nisi soluta facilis, sunt molestias deleniti culpa
          voluptatum minus quas? Nisi libero, sit odit porro eos deserunt
          debitis velit eum cumque consequuntur illum nam suscipit. Dolorem et
          est aperiam quas odit libero deleniti harum, minima labore! Voluptates
          magni alias commodi laboriosam omnis rem asperiores eligendi similique
          aut numquam eos explicabo voluptate, laborum veritatis corporis
          quisquam sed eius, a dolore maiores nostrum necessitatibus minus. Eius
          amet corporis facilis beatae eveniet, incidunt temporibus velit iste
          inventore sint commodi fugiat. Incidunt, in. Adipisci tenetur nisi
          modi? Nisi officiis, asperiores accusantium enim doloribus doloremque
          aut nobis accusamus, porro quaerat similique eos quisquam nesciunt,
          fugit nihil odio maxime corporis facere vitae cum fugiat rerum modi
          aliquid sint? Cupiditate ea quia ad? Reprehenderit ullam ea ad
          necessitatibus fugit veniam quis tenetur architecto, iure vitae aut,
          fugiat minima alias, quo inventore iusto omnis iste quae repellendus
          aperiam facere. Deleniti, officiis impedit repudiandae quod
          consequatur alias debitis iusto soluta ad quaerat voluptatibus
          corrupti veniam perferendis? Non minima itaque aperiam, nostrum
          voluptas laborum? Cupiditate omnis aliquam et earum quod. Placeat
          temporibus impedit, sint hic repellendus sunt? Libero perferendis vel
          ipsam veritatis aspernatur soluta mollitia! Tempora repellat quo
          quisquam ipsum, qui eos odio? Magnam, mollitia at velit ipsa ipsum
          natus dolore eligendi magni provident a. Expedita laudantium, illo,
          mollitia quaerat adipisci voluptas, corrupti nihil aut doloremque nam
          aliquam. Voluptatum ex repellat ducimus aliquid porro tempora dolore
          obcaecati quam nisi facilis, beatae magni et ipsum at, labore, enim
          excepturi libero. Rem adipisci rerum dolorem iste maxime pariatur
          facere ratione deleniti quibusdam commodi accusantium autem, ullam
          nobis tenetur molestiae ipsa vel fugit possimus dignissimos corrupti
          laboriosam, explicabo quos. Consequuntur laudantium maxime corrupti
          dolore debitis architecto amet nam nesciunt dolor, nulla enim quo ut
          exercitationem rerum. Repellat aut qui quaerat quibusdam atque ad
          omnis minima alias exercitationem! Dolores fuga aperiam animi
          recusandae temporibus nihil eveniet nisi, itaque eius ad
          necessitatibus maiores et consequatur est cupiditate tempore
          voluptatem dolorum? Cupiditate pariatur esse beatae voluptate nihil
          quam dolorum quas aliquam ipsam minima atque quia expedita quae harum
          nisi ratione, assumenda veniam similique doloribus deserunt, illo
          tempora fugiat. Eius, tenetur expedita. Porro qui excepturi
          consequatur quia ipsa voluptates debitis labore sed minima eaque illum
          nemo facere reiciendis nobis omnis necessitatibus repellat culpa, ab
          ducimus molestiae ratione doloribus voluptate perferendis dicta. Quod,
          officia quibusdam in nulla velit mollitia hic necessitatibus aliquid
          tempora id corrupti? Neque pariatur beatae quas, qui totam nihil
          perspiciatis ab ipsam nam. Excepturi minus harum similique fugiat sint
          cumque! Voluptas libero deserunt dolorem aut odio! Asperiores natus
          harum nemo ratione animi aliquid, accusamus dicta doloribus quaerat
          cupiditate recusandae magnam hic minus corporis iste voluptatem beatae
          porro, velit eum vero repellat omnis voluptatibus. Eveniet iste
          numquam eius doloremque sed voluptas est unde repudiandae tempora
          quia, perspiciatis et ad eum rerum repellendus voluptates nemo magni
          quam omnis corporis. Molestias, quisquam totam! Mollitia nobis a nihil
          quisquam quis maiores! Perferendis nulla et repudiandae fugit
          repellendus, facere magni laboriosam ipsam. Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Totam, ut. Id perspiciatis quos natus ex
          explicabo pariatur cumque facilis dignissimos libero numquam vero,
          quibusdam, ipsam cum. Reiciendis repellat harum ipsa mollitia, fugit
          ipsam sunt ab, eos unde deleniti doloremque enim nulla, totam facilis
          atque voluptatum id. Hic eius libero ut aspernatur aut necessitatibus
          odio asperiores facere, vitae dignissimos sed veniam perferendis
          laboriosam? Ipsa provident, est perferendis aliquam amet dolorum quod
          eveniet unde corrupti. Et quasi, quas mollitia culpa eius soluta id
          incidunt ullam accusantium iure qui illo quibusdam, in voluptatibus
          reiciendis, earum recusandae necessitatibus pariatur expedita
          accusamus assumenda officiis minima sit optio. Maxime consequatur
          fugit, similique aut esse rem accusamus blanditiis quod consectetur
          consequuntur enim, quae ut quibusdam vitae, ratione eveniet! Nemo sunt
          impedit vitae nobis ullam velit? Voluptatum deserunt cum dolores
          necessitatibus ex ut, autem eos doloribus beatae? Deserunt eveniet
          animi nihil possimus aliquam, atque magnam fuga aliquid modi, non
          eaque rerum quod quis ipsa quam ipsam odit necessitatibus numquam
          molestias aspernatur delectus quos! Maiores earum totam aliquid quam
          ab id dicta corrupti ea doloremque quae nam, impedit iusto ullam
          perferendis necessitatibus voluptates quidem sequi, quo recusandae
          provident animi nulla officia. Placeat eum ratione numquam repellendus
          quasi provident voluptatem amet quas. Magnam ea praesentium delectus
          rem doloremque nobis ipsum aut tempore quo dolore! Quibusdam,
          consequatur tempore dolorum sed reiciendis odio doloremque architecto
          officiis obcaecati, a animi velit aspernatur libero voluptate? Hic,
          nesciunt, sed distinctio ad velit amet quidem, cupiditate at quis
          pariatur tempore earum eaque minima non totam accusamus officiis
          expedita animi voluptatibus reiciendis. Culpa, consequatur blanditiis!
          Delectus magni quod ipsum illum laudantium eos pariatur repellat
          eaque, natus totam doloremque animi quidem reiciendis tempore officia
          porro repellendus molestiae dicta. Esse, voluptates ad beatae
          reiciendis aperiam, suscipit officiis nostrum doloremque et tempore,
          voluptas perferendis? Fuga, quod. Architecto suscipit consequuntur
          iusto, dolore culpa aspernatur molestias perspiciatis porro veniam ad
          harum quasi consequatur autem amet laudantium nobis facilis, quidem
          excepturi nemo provident quod obcaecati. Consequatur, possimus et
          fugit magnam sunt corporis nulla nesciunt tenetur molestiae
          repellendus, eum laborum quia minus nihil quisquam laudantium
          voluptatibus. Nisi numquam voluptatem esse commodi ullam maxime
          suscipit. Accusamus, aliquid porro odio omnis similique iure.
          Recusandae consequuntur est qui dolorem quos iusto blanditiis facere
          dignissimos ipsam mollitia et porro doloribus distinctio dolore nemo
          quod quasi, praesentium placeat similique, ducimus quidem sequi
          eligendi! Sed dolore dolor modi nam quis vero corporis cumque
          molestiae reprehenderit! Quae modi, inventore hic sit soluta magni,
          placeat nihil alias a dolorem vitae temporibus architecto quasi sequi
          repellat distinctio earum eligendi. Molestiae accusamus doloribus ipsa
          hic similique, culpa nam, excepturi magnam, nihil modi totam! Corporis
          ad quaerat quibusdam inventore incidunt a officia iusto excepturi
          numquam fugiat deserunt sed, nemo, quidem dolor architecto
          exercitationem accusantium cumque cupiditate vitae delectus totam
          rerum quos. Expedita ullam suscipit veritatis enim, dolores at cum
          itaque, architecto nostrum temporibus, quam debitis tenetur earum modi
          dignissimos obcaecati officiis sit doloremque eligendi reprehenderit
          culpa repudiandae? Ducimus quaerat harum maxime quam eaque, vitae
          nulla autem fugiat, cum repellendus perspiciatis exercitationem
          similique tenetur repudiandae ipsum reprehenderit ipsam in sit quos
          praesentium est vel itaque facilis aliquid? Laudantium quod placeat
          expedita quis illum autem illo beatae enim omnis! Libero voluptatibus
          nostrum cupiditate commodi ducimus eligendi veritatis sint
          necessitatibus provident, soluta odio maxime! Porro voluptates
          consequatur adipisci atque, cum quae nemo pariatur et ipsa vel
          assumenda ad laboriosam molestiae est! Laudantium rerum animi ipsum
          consectetur adipisci ratione exercitationem qui temporibus at alias
          aspernatur sed ab aliquid consequatur velit sit a quis est soluta
          suscipit tenetur, accusamus beatae molestias optio! Assumenda
          consequuntur eos dolorem corrupti modi porro odit tempore, ea nostrum,
          aliquid enim. Perspiciatis, natus, dicta consequatur accusantium
          ipsam, omnis quis libero earum eaque nemo ducimus porro veniam
          necessitatibus voluptates doloribus quas consequuntur obcaecati
          incidunt autem. Ducimus esse beatae tempora ullam? Tenetur commodi sed
          sunt delectus odit sapiente explicabo, porro at dicta reiciendis
          pariatur, eius quae mollitia doloremque dolor nihil error ipsam
          blanditiis debitis officia expedita enim officiis, odio voluptatibus?
          Atque incidunt quam ullam nobis dignissimos praesentium id porro
          ducimus, ratione fugiat, dolores consequuntur debitis culpa eaque
          maxime, suscipit voluptatem dicta ipsam magnam officiis odit commodi
          sapiente dolor quasi. Minima ex deserunt, veniam incidunt vitae
          eveniet enim doloribus impedit atque amet. Eum animi, fugit numquam
          neque tempora eius itaque et rerum magnam quos sint hic maiores
          praesentium. Aliquam eius eligendi obcaecati odio assumenda non, ipsam
          incidunt eaque soluta, velit, eum fugiat excepturi voluptatibus omnis.
          Eveniet sit, ratione modi unde vel iure ut sequi? Quasi, quibusdam?
          Voluptas quas deserunt ipsam dolor laboriosam? Mollitia perspiciatis
          sint ipsam ad rerum nesciunt repellendus voluptate commodi error cum
          consectetur assumenda, molestiae doloribus soluta, ducimus tempora
          dicta voluptatum atque ex aliquam aut officiis. Cumque odio assumenda
          dolorem explicabo unde repellendus repellat. Quod cumque, obcaecati
          ipsum ipsam fuga voluptates hic id magnam, sunt ea officiis repellat
          nisi, adipisci explicabo modi sint praesentium perspiciatis doloremque
          odio labore maiores reiciendis voluptatem facilis! Doloremque
          asperiores quas rerum cupiditate tenetur veniam minus incidunt ex
          assumenda nostrum qui inventore, pariatur doloribus fugiat laborum
          aliquam dicta facere non eligendi maxime praesentium sapiente iusto.
          Soluta beatae quos esse est animi. Laboriosam est, odit consectetur
          quo omnis, repudiandae dolores, reprehenderit reiciendis esse magni
          tenetur odio adipisci illum facere. Autem asperiores ipsam quis fuga
          eos nobis neque nihil, alias minima, unde iusto commodi cupiditate sit
          aut dolore provident sunt dolores illum molestiae perspiciatis
          repellendus impedit a! Autem ea quaerat doloribus modi quas et esse
          incidunt itaque quae error assumenda sequi iure tenetur delectus
          dolores pariatur similique, placeat sed omnis, inventore adipisci rem
          beatae nemo sint? Eligendi ea cum saepe odio aut veritatis? Reiciendis
          id facilis eaque, nemo quaerat magni! Officiis, voluptatibus magni
          culpa libero eaque, error quo neque maxime ullam eligendi eum autem
          eos reprehenderit! Optio, eligendi cupiditate. Nesciunt fugiat tenetur
          cumque est, molestias aliquam mollitia alias id a quas laudantium
          labore autem. Eaque voluptatibus illo distinctio inventore? Esse ab
          consectetur adipisci temporibus labore alias harum itaque sint officia
          at repellat accusantium vitae, atque exercitationem dolorum laboriosam
          dolore quo obcaecati illo excepturi est consequuntur nemo. Explicabo
          ab voluptatum quisquam assumenda possimus similique vitae veritatis.
        </div>
      </div>
      <div className=" h-full w-1/3 z-[-1]" id="sidebar">
        <motion.div
          className="bg-orange-400 z-10 h-full"
          style={
            sidebarTop <= 0 && sidebarTop != null && sidebarTop != undefined
              ? { position: "fixed", top: 0 }
              : {}
          }
          id="content_wrapper"
        >
          <div className="h-[300px] w-full bg-red-400">
            {activeCategory} Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
            nobis nulla ipsa at corporis maxime, eaque voluptates voluptatibus
            ullam quod? Atque cumque reiciendis doloribus hic repellendus dicta
            explicabo possimus obcaecati.
          </div>
          <div className="h-[300px] w-full bg-red-400"></div>
          <div className="h-[300px] w-full bg-red-400"></div>
          <div className="h-[300px] w-full bg-red-400"></div>
          <div className="h-[300px] w-full bg-red-400"></div>
        </motion.div>
      </div>
    </div>
  );
};

TheChronicle.propTypes = {
  activeCategory: PropTypes.string.isRequired,
};

export default TheChronicle;
