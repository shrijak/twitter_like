document.addEventListener('DOMContentLoaded', function() {
  let all_data_len=parseInt($("#all_posts").data("max_post"));
  for(let j=1; j <= Math.ceil(all_data_len / 10);j++){
    let li = document.createElement('li');
    li.setAttribute('class', 'page-item')
    li.innerHTML = `<p style="cursor: pointer;" class="page-link text-primary page" data-max_val = "${all_data_len}" data-pgno ="${j}" >${j}</p>`;
    document.querySelector('#page_number').append(li);
    }

    if(all_data_len>10){
    for(let k=11;k<=all_data_len;k++){
      $(`#post${k}`).hide();
    }}

    $('#page_number').on('click','.page',function(event){
                let page_no = parseInt($(this).data("pgno"));
                let max_val = parseInt($(this).data("max_val"));
                let max_page = Math.ceil(max_val / 10);

                $('.posts').hide();

                if(page_no < max_page){
                  for(let i = 1 + 10*(page_no-1); i<=10+ 10*(page_no-1);i++){
                    $(`#post${i}`).show();
                  }
                }
                else{
                  for(let i = 1 + 10*(page_no-1); i<=max_val;i++){
                    $(`#post${i}`).show();
                  }
                }
                  window.location.href = "#top";
        });


  $(".like").each(function (index, element) {
          if ($(this).data("l_u") == "Y") {
              $(this).attr("src",`${liked_src}`);
          }
          else {
              $(this).attr("src",`${like_src}`);
          };
      });

      $('#all_posts').on('click','.user',function(event){
        window.location.href = `/user/${$(this).data("username")}`;
      });

  $('#all_posts').on('click','.like',function(event){
             fetch('/like_unlike', {
                 method: 'PUT',
                 body: $(this).data("tweetid")
             })
              .then(response => response.json())
              .then(result => {

                      if(result.flag === "Y"){
                        $(`#l${$(this).data("tweetid")}`).attr('src',`${liked_src}`);
                      }
                      else{
                        $(`#l${$(this).data("tweetid")}`).attr('src',`${like_src}`);
                      }
                      $(`#lv${$(this).data("tweetid")}`).html(`${result.likes_num}`);
              });
      });
  });
