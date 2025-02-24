import { useEffect } from "react";

const CommentSidebar = () => {
  useEffect(() => {
    // Disable scrolling but keep the scrollbar visible
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflowY = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      // Restore original styles when the sidebar is closed
      document.body.style.overflowY = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  return (
    <div className="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-70 z-[60] overflow-hidden select-none">
      <img
        src="/OtherImg/CommentPaperCutHalf.png"
        alt="Paper bg"
        className="pointer-events-none absolute top-0 right-0 w-full object-contain"
        draggable="false"
      />
      <p className="w-full h-full absolute top-0 left-0 flex justify-center items-center">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusantium in
        aspernatur ex doloremque quod, ipsam eligendi, unde soluta recusandae
        eum nostrum repudiandae ullam suscipit quos exercitationem fugiat enim
        commodi inventore ducimus ipsa cumque, quaerat voluptatibus. Vitae
        distinctio accusantium possimus commodi dignissimos voluptatibus quasi
        corporis nisi, est, laborum minima consequuntur odit repellat illum,
        inventore alias porro dolores assumenda iure! Dignissimos sequi corrupti
        quam sed, quibusdam magnam amet, delectus ad omnis id dolores,
        reiciendis explicabo aperiam harum ab eligendi officiis nesciunt
        accusamus cupiditate expedita voluptatum numquam debitis quasi earum?
        Aliquid quis molestiae totam explicabo maxime? Neque, magni dolorum
        velit in hic mollitia maiores? Iste, repudiandae tempore at modi
        molestiae quae nobis debitis odio excepturi! Deserunt necessitatibus
        numquam quo quisquam hic atque placeat sit nobis, commodi perspiciatis
        perferendis repellendus? Qui iusto velit at eligendi non sint laudantium
        itaque deleniti enim minus tempora illo, voluptatum eum! Quas cum saepe
        exercitationem itaque? Quidem at asperiores iste sunt incidunt
        voluptates sint culpa error quisquam eveniet, necessitatibus ratione
        saepe dolore et numquam laudantium molestiae soluta omnis facere fugit.
        Excepturi et, ratione molestiae temporibus deleniti in ea sequi beatae
        soluta quis reiciendis labore voluptates aperiam voluptatem corrupti
        nam, nobis eligendi dignissimos quidem illum accusamus cupiditate nisi
        quibusdam. Alias expedita labore magni reprehenderit recusandae id,
        suscipit assumenda dolore nobis qui enim mollitia, aliquam repellendus
        aperiam fugiat excepturi hic facilis corrupti adipisci voluptatum
        ratione impedit deserunt quasi vitae. Labore ipsa id quasi magni iusto
        dolorum, quae molestias repellat. Harum ipsa aliquid delectus quis odio
        sed ratione inventore id non labore. Rem nobis voluptate voluptates
        corporis harum, impedit tempore facere temporibus consequuntur est quis
        architecto. Accusantium, cum pariatur, eum necessitatibus vero autem
        vitae unde omnis cumque error voluptates molestias, explicabo officiis.
        Expedita dolorum repellat magni harum! Repellendus consequuntur tempora
        voluptatum quos, repudiandae libero! Quo nostrum quisquam, ea nobis
        assumenda placeat illum quasi dolorem culpa eum quis odit, et totam
        praesentium quam doloribus explicabo! Vero numquam voluptas obcaecati
        iure aliquam maiores quos dolores possimus quaerat quod, iusto magni
        consequatur. Optio itaque quisquam rerum, eveniet in, doloribus autem
        iste, minima fugit alias hic impedit molestiae ratione repudiandae sunt
        nulla harum pariatur aliquam quis aut est corporis ad eaque. Nostrum,
        vitae ad. Quaerat saepe delectus quis laboriosam porro consequatur amet
        nam praesentium deleniti. Eius quam vero quo perferendis animi, magni
        doloremque cupiditate! Nulla provident similique accusantium eveniet hic
        aut nihil dolorum soluta, odio necessitatibus itaque. Nostrum, tenetur.
        Itaque praesentium repellat quam ab nihil ducimus rem asperiores
        deleniti ex, dolore officiis repudiandae enim at ipsa debitis culpa
        totam aspernatur esse nisi? Impedit cupiditate libero in? Praesentium,
        velit adipisci nobis autem impedit unde quasi cumque deserunt,
        distinctio pariatur, aliquid alias qui minus dolores laudantium
        obcaecati. Dolorum, pariatur harum ipsum, qui magni repellendus
        consequatur sint quos similique a magnam? Nesciunt similique quidem
        corrupti aut minus maiores cum praesentium. Reprehenderit sit quibusdam
        similique reiciendis autem consectetur nostrum iusto, laboriosam placeat
        voluptate id pariatur assumenda dicta fugiat rerum tenetur tempora
        labore nisi enim! Corrupti repellendus odit dignissimos perspiciatis
        architecto nam, vel, consequuntur reiciendis ipsum excepturi blanditiis
        sapiente at asperiores.
      </p>
    </div>
  );
};

export default CommentSidebar;
