(function($){

    var Menu = function(){
        var _ = this;

        /* defaults options */
        _.o = {

            // title : "title",     /* side menu title */

            // items : [],          /* side menu items - type:[json]*/

            fixed : false,          /* is fixed when window scroll */

            width : 350,            /* side menu width */

            prefix : "x"            /* css class prefix */

        };

        /* initialization function */
        _.init = function(element,options){

            /* set options */
            options && $.extend(_.o,options);

            _.el = element;

            /* css class */
            _.cls = getClassName(_.o.prefix);

            /* templates */
            _.tpl = getTemplate();

            /* render a side menu */
            _.renderMenu();

            /* play menu (listen for events) */
            _.playMenu();

            _.o.fixed && _.fixedMenu();

            return _;
        };

        /* get css class name */
        function getClassName(prefix){

            /* defaults class name */
            var cls = {

                sideMenu : "side-menu",

                menuTitle : "menu-title",
                menuItems : "menu-items",
                menuItem : "menu-item",
                menuItemTitle : "menu-item-title",

                subMenuItems : "sub-menu-items",
                subMenuItem : "sub-menu-item",
                subMenuItemTitle : "sub-menu-item-title",
                subMenuItemLevel : "sub-menu-level",

                hasFold : "item-hasFold",
                unfoldItem : "item-unfolded",
                curItem : "item-curr",

                scrolling : "on-scrolling"
            };

            /* add prefix */
            $.each(cls, function(key,value){
                cls[key] = prefix + "-" + value;
            });

            return cls;
        }

        /* get menu templates */
        function getTemplate(){
            var tpl = {

                sideMenu : "<div class='{cls}'>{title}{items}</div>",

                menuTitle : "<div class='{cls}'><h3>{title}</h3></div>",

                items : "<ul class='{cls}'>{items}</ul>",

                item : "<li class='{cls}' id='{id}'>{title}{subItems}</li>",
                title : "<div class='{cls}'><i></i><span><a href='{href}'>{title}</a></span></div>"

            };

            return tpl;
        }

        /* create a menu item or a sub menu item (li) */
        function createItem(item,type){
            var _item = _.tpl.item,
                _title = _.tpl.title.replace("{cls}", "{cls} "+_.cls.subMenuItemLevel+type);

            /* type === 1 for level one */
            if(type === 1){
                _item = _item.replace("{cls}", _.cls.menuItem + (item.subItems?" " + _.cls.hasFold:"")+ (item.cls?" " + item.cls:""));
                item.cls = _.cls.menuItemTitle;
            }
            else{
                _item = _item.replace("{cls}", _.cls.subMenuItem + (item.subItems?" " + _.cls.hasFold:"")+ (item.cls?" " + item.cls:""));

                item.cls = _.cls.subMenuItemTitle;
            }

            if(!("href" in item)){
                _title = _title.replace("href='{href}'","");
            }

            $.each(item,function(key,value){
                _title = _title.replace("{"+key+"}",value);
            });

            _item = _item.replace("{title}",_title);

            if("id" in item){
                _item = _item.replace("{id}",item.id);
            }
            else{
                _item = _item.replace("id='{id}'","");
            }

            if("subItems" in item){
                _item = _item.replace("{subItems}",createItems(item.subItems,type+1));
            }
            else{
                _item = _item.replace("{subItems}","");
            }

            return _item;
        }

        /* create a menu or a sub menu (ul) */
        function createItems(items,type){

            var _items = "";

            $.each(items,function(key,item){
                _items += createItem(item,type);
            });

            _items = _.tpl.items.replace("{items}",_items);

            /* type === 1 for level one */
            if(type === 1){
                _items = _items.replace("{cls}", _.cls.menuItems);
            }
            else{
                _items = _items.replace("{cls}", _.cls.subMenuItems);
            }

            return _items;
        }

        /* create a side menu (div.side-menu) */
        function createMenu(){
            var _menu,_title = "";

            _menu = _.tpl.sideMenu.replace("{cls}", _.cls.sideMenu);

            if("title" in _.o) {
                _title =  _.tpl.menuTitle.replace("{cls}", _.cls.menuTitle + (_.o.cls?" "+_.o.cls:""));
                _title = _title.replace("{title}", _.o.title);
            }

            _menu = _menu.replace("{title}",_title);

            _menu = _menu.replace("{items}",createItems(_.o.items,1));

            return _menu;
        }

        /* render a side menu / append a side menu to _.el */
        _.renderMenu = function(){

            _.menu = $(createMenu());

            _.menu.css("width", _.o.width);

            _.el.append(_.menu);

        };

        /* play side menu / add event listener (li>div) */
        _.playMenu = function(){

            _.menu.find("ul."+ _.cls.menuItems+" ul").hide();

            _.menu.find("."+ _.cls.unfoldItem+" > ul").show();

            _.titles = _.menu.find("." + _.cls.menuItemTitle + ",." + _.cls.subMenuItemTitle);

            _.titles.on("click",function(){
                _.clickTitle($(this),_.cls.curItem);
            });

        };

        /* call this function when menu item slides done */
        _.callback = function(){
            _.o.fixed && $(window).trigger("scroll");
        };

        /* fold a item menu (li) */
        _.foldItem = function(el,cls){
            if(!el.hasClass(cls)) return;
            el.find("ul").slideUp("fast", _.callback);
            el.find("."+ cls).removeClass(cls);
            el.removeClass(cls);
        };

        /* unfold a menu item and fold siblings (li) */
        _.unfoldItem = function(el,cls){
            if(el.hasClass(cls)) return;
            el.addClass(cls);
            el.children("ul").slideDown("fast", _.callback);
            el.siblings().each(function(){
                _.foldItem($(this),cls);
            });
        };

        /* toggle fold/unfold a menu item (li) */
        _.foldToggle = function(el,cls){

            if(el.hasClass(cls)){
                _.foldItem(el,cls);
            }
            else{
                _.unfoldItem(el,cls);
            }
        };

        /* change current selected item (li>div) */
        _.changeCurItem = function(el,cls){
            _.curItem && _.curItem.removeClass(cls);
            _.curItem = el;
            _.curItem.addClass(cls);
        };

        /* a function bind on the title click event */
        _.clickTitle = function(el,cls){
            _.changeCurItem(el,cls);
            _.foldToggle(el.closest("li"), _.cls.unfoldItem);
        };

        /* menu resize */
        _.resizeMenuHeight = function(){
            _.height = _.menu.height();

            _.el.css("min-height", _.height);

            _.maxScrollTop = _.o.offset.offset().top + _.o.offset.height() - _.height;
        };

        /* fixed menu when window scroll */
        _.fixedMenu = function(){

            _.o.offset = $(_.o.offset);

            _.wHeight = $(window).height();

            _.resizeMenuHeight();

            $(window).on("scroll",function(){
                _.relocateMenu($(this));
            });

            $(window).on("resize",function(){

                _.wHeight = $(window).height();

                _.relocateMenu($(this));
            });

            _.menu.on("mouseenter", _.menuMouseEnter);

            _.menu.on("mouseleave",_.menuMouseLeave);

            $("body").on("mousewheel", function(e){
                if(_.menu.hasClass(_.cls.scrolling)){
                    _.menuScroll(e) && e.preventDefault() , e.stopPropagation();
                }
            });

        };

        /* menu mouse enter event function */
        _.menuMouseEnter = function(){
            _.menu.addClass(_.cls.scrolling);
        };

        /* menu mouse leave event function */
        _.menuMouseLeave = function(){
            _.menu.removeClass(_.cls.scrolling);
        };

        /* scroll menu */
        _.menuScroll = function(e){

            if(_.height <= _.wHeight || _.scrollTop <= _.offset.top || _.scrollTop > _.maxScrollTop) return false;

            _.locateMenu(-e.originalEvent.wheelDelta);

            return true;
        };

        /* relocate menu (if is a fixed menu) */
        _.relocateMenu = function(e){

            _.offset = _.el.offset();
            var tmp = e.scrollTop() - _.scrollTop;
            tmp = tmp >= 0 ? 0 : tmp;
            _.scrollTop = e.scrollTop();
            _.scrollLeft = e.scrollLeft();
            _.resizeMenuHeight();

            _.locateMenu(tmp);

        };

        /* locate menu (if is a fixed menu) */
        _.locateMenu = function(x){
            var tmp = -parseInt(_.menu.css("top"));
            tmp += x;
            tmp = tmp <= 0 ? 0 : tmp;

            tmp = _.height > _.wHeight && (tmp > _.height - _.wHeight && _.height - _.wHeight || tmp ) ;

            if(_.scrollTop <= _.offset.top + tmp){
                _.menu.css({position: "relative",top: 0,left: 0});
            }
            else if(_.scrollTop <= _.maxScrollTop + tmp ){
                _.menu.css({position: "fixed",top: -tmp,left: _.offset.left-_.scrollLeft});
            }
            else{
                _.menu.css({position: "fixed",top: _.maxScrollTop-_.scrollTop,left: _.offset.left-_.scrollLeft});
            }

        }

    };

    $.fn.menu = function(o){
        var len = this.length;

        return this.each(function(index){

            var _ = $(this),
                key = 'menu'+(len>1?'-'+ ++index:''),
                instance = (new Menu()).init(_,o);
            _.data(key,instance).data('key',key);
        });
    };
})(jQuery);