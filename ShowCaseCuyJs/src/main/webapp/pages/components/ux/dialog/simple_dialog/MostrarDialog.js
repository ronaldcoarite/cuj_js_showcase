let btnShowDialog = this.findViewById('btnShowDialog');
btnShowDialog.setOnClickListener(async view=>{
    let dialog = new DialogSimpleExample(this);
    await dialog.show();
});