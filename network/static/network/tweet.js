fetch('/tweet_api')
    .then(response => response.json())
    .then(data => {
      let all_data_len=data.length;
      for(let j=1; j <= Math.ceil(all_data_len / 10);j++){
        let li = document.createElement('li');
        li.setAttribute('class', 'page-item')
        li.innerHTML = `<p style="cursor: pointer;" class="page-link text-primary page" data-max_val = "${all_data_len}" data-pgno ="${j}" >${j}</p>`;
        document.querySelector('#page_number').append(li);
        }

      for (let i = 0; i < all_data_len; i++) {
        let div = document.createElement('div');
        div.setAttribute('id', `post${i}`)
        div.setAttribute('class', `posts`)
        let image;
        if(data[i].flag === "Y"){
          image=`${liked_src}`;
        }
        else{
          image=`${like_src}`;
        }
        if(data[i].edit === "N"){
        div.innerHTML = `<div class="bg-light rounded p-3 mb-3">
        <p class="pb-1 border-bottom"><span data-username="${data[i].user}" class="user" style="cursor: pointer;">
        <span class="h5">${data[i].first_name} ${data[i].last_name}</span><br/>
        <span class="small">@${data[i].user}</span>
        </span></p>
        <p class="text-justify">${data[i].body}</p>
        <p class="p-1 border-top"><span class="float-left"><img style="cursor: pointer;" id="l${data[i].id}" data-tweetid="${data[i].id}" role="button" class="pr-1 like" width="20px" src=${image}><span id="lv${data[i].id}">${data[i].like}</span></span>
        <span class="float-right">${data[i].timestamp}</span></p>
        </div>`;
      }
      else{
        div.innerHTML = `<div class="bg-light rounded p-3 mb-3">
        <p style="text-align:left;vertical-align:middle;" class="border-bottom pb-1"><span data-username="${data[i].user}" style="cursor: pointer;" class="user">
        <span class="h5">${data[i].first_name} ${data[i].last_name}</span><br/>
        <span class="small">@${data[i].user}</span>
        </span>
         <span class="text-primary edit" id="e${data[i].id}" role="button" data-tweetid="${data[i].id}" style="float:right;cursor:pointer;">Edit</span></p>
        <p id="b${data[i].id}" class="text-justify">${data[i].body}</p><textarea style="display:none;" id="t${data[i].id}" class="text-justify form-control"></textarea>
        <input style="display:none;" type="submit" value="Save" id="s${data[i].id}" data-tweetid="${data[i].id}" class="editbutton text-center mt-1 mb-1 btn btn-primary"/>
        <p class="p-1 border-top"><span class="float-left"><img style="cursor: pointer;" id="l${data[i].id}" data-tweetid="${data[i].id}" role="button" class="pr-1 like" width="20px" src=${image}><span id="lv${data[i].id}">${data[i].like}</span></span>
        <span class="float-right">${data[i].timestamp}</span></p>
        </div>`;
      }
        document.querySelector('#all_posts').append(div);
      }

      if(all_data_len>9){
      for(let k=10;k<all_data_len;k++){
        $(`#post${k}`).hide();
      }}

    });

document.addEventListener('DOMContentLoaded', function() {

  $('#page_number').on('click','.page',function(event){
              let page_no = parseInt($(this).data("pgno"));
              let max_val = parseInt($(this).data("max_val"));
              let max_page = Math.ceil(max_val / 10);

              $('.posts').hide();

              if(page_no < max_page){
                for(let i = 0 + 10*(page_no-1); i<10+ 10*(page_no-1);i++){
                  $(`#post${i}`).show();
                }
              }
              else{
                for(let i = 0 + 10*(page_no-1); i<max_val;i++){
                  $(`#post${i}`).show();
                }
              }
                window.location.href = "#top";
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

        $('#all_posts').on('click','.user',function(event){
          window.location.href = `/user/${$(this).data("username")}`;
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
