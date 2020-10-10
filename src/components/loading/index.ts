import Loading from "./index.vue"
let loadingIntance: Loading | null = null;
export default {
    show(icon?: string, name?: string) {
        if (!loadingIntance) {
            loadingIntance = new Loading({ data: { icon: name ? icon : "", text: name || icon } });
            let div = document.createElement('div');
            document.body.prepend(div)
            loadingIntance.$mount(div);
        } else {
            loadingIntance.$set(loadingIntance, 'icon', name ? icon : "");
            loadingIntance.$set(loadingIntance, 'text', name || icon);
        }
    },
    hide(...args: any[]) {
        if (args.length) {
            if (args.length >= 1) {
                loadingIntance!.$set(loadingIntance!, 'text', args[0]);
            }
            if (args.length >= 2) {
                loadingIntance!.$set(loadingIntance!, 'icon', args[1]);
            }
            if (args.length >= 3) {
                if (args[2]) {
                    setTimeout(() => {
                        this.hide();
                    }, args[2])
                } else {
                    $(loadingIntance!.$el).on('click', () => {
                        this.hide();
                    })
                }
            }
        } else {
            loadingIntance!.$el.remove();
            loadingIntance = null;
        }

    }
}