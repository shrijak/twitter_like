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

      $('#all_posts').on('click','.edit',function(event){
                  let text = $(`#b${$(this).data("tweetid")}`).html();
                  $(`#b${$(this).data("tweetid")}`).hide();
                  $(`#t${$(this).data("tweetid")}`).text(text);
                  $(`#t${$(this).data("tweetid")}`).show();
                  $(`#s${$(this).data("tweetid")}`).show();
                  $(`#t${$(this).data("tweetid")}`).on('keydown', autosize);
          });

          $('#all_posts').on('click','.editbutton',function(event){
                      fetch('/edit_tweet', {
                         method: 'PUT',
                       body: JSON.stringify({content: $(`#t${$(this).data("tweetid")}`).val() , tweet_id: $(this).data("tweetid")})
                      })
                       .then(response => response.json())
                       .then(result => {
                     $(`#b${$(this).data("tweetid")}`).html(`${result.content}`);
                     $(`#t${$(this).data("tweetid")}`).hide();
                     $(`#s${$(this).data("tweetid")}`).hide();
                     $(`#b${$(this).data("tweetid")}`).show();
                       });
              });

              let unfollow_btn =document.querySelector('#unfollow_btn');
if (unfollow_btn !== null) {
            unfollow_btn.onmouseover = function () {
            unfollow_btn.value = "Unfollow"
            unfollow_btn.className = "btn btn-danger"
        };
      unfollow_btn.onmouseout = function () {
            unfollow_btn.value = "Following"
            unfollow_btn.className = "btn btn-success"
            }
          }

            if (document.querySelector('#new-tweet') !== null){
              document.querySelector('#new-tweet').addEventListener('click', () => {
                fetch('/tweet', {
                    method: 'POST',
                    body: JSON.stringify({
                      body: document.querySelector('#tweet-body').value
                    })
                  })
                  .then(response => response.json())
                  .then(result => {});
              });
}
              var textarea = document.querySelector('textarea');
              if(textarea !== null) {
              textarea.addEventListener('keydown', autosize);
            }
  });

  function autosize(){
  var el = this;
  setTimeout(function(){
    el.style.cssText = 'height:auto; padding:0';
    el.style.cssText = 'height:' + el.scrollHeight + 'px';
  },0);
  }
