class DialogSimpleExample extends Dialog{
    constructor(context){
        super(context);
        this.setContentView("pages/components/ux/dialog/simple_dialog/DialogSimpleLayout.xml");
    }

    async onClickCerrar(){
        this.cancel(null);
    }
}