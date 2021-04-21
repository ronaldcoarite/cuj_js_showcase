/* global LayoutInflater, DescriptionCreator, Resource, Toast */

class ComponentsPage extends Page {
    constructor(context) {
        super(context);
        this.setContentView("pages/components/ComponentsLayout.xml");
    }
    
    async onStart(){
        await Resource.import('pages/components/DescriptionCreator.js');
        this.fraContainer = this.findViewById('fraContainer');
        
        let json = await DescriptionCreator.getJson('pages/components/views/textview/textView.json');
        let result = await this.create(this,json);
        await this.fraContainer.setFirstChild(result.view);
        await this.executeAllScript(result.scripts);
    }
    
    async onClickTextView(){
        let json = await DescriptionCreator.getJson('pages/components/views/textview/textView.json');
        let result = await this.create(this,json);
        await this.fraContainer.setFirstChild(result.view);
        await this.executeAllScript(result.scripts);
    }
    
    async onClickButton(){
        let json = await DescriptionCreator.getJson('pages/components/views/button/button.json');
        let result = await this.create(this,json);
        await this.fraContainer.setFirstChild(result.view);
        await this.executeAllScript(result.scripts);
    }
    
    async onClickLinkButton(){
        let json = await DescriptionCreator.getJson('pages/components/views/linkbutton/linkbutton.json');
        let result = await this.create(this,json);
        await this.fraContainer.setFirstChild(result.view);
        await this.executeAllScript(result.scripts);
    }
    
    async onClickButtonExample(){
        Toast.makeText(this,'On Click desde pagina o dialogo',Toast.LENGTH_SHORT);
    }
    
    async create(context, view){
        let result = {
            view: null,
            scripts: new Array()
        };
        let linContainer = new LinearLayout(context);
        linContainer.setOrientation('vertical');
        
        // TITULO
        let txtTitle = new TextView(context);
        await txtTitle.setText(view.title);
        await txtTitle.setSingleLine(true);
        await txtTitle.setDrawableLeft(view.icon);
        txtTitle.setIconWidth('50px');
        txtTitle.setIconHeight('50px');
        txtTitle.setTextSize('20px');
        await linContainer.addView(txtTitle);
        
        // LINEA TITULO
        let viewLine = new TextView(context);
        viewLine.setWidth('600px');
        viewLine.setHeight('10px');
        viewLine.setMarginTop('10px');
        viewLine.setMarginBottom('5px');
        await viewLine.setBackground('pages/components/imgs/bg_barra.9.png');
        await linContainer.addView(viewLine);
        
        // DESCRIPCION
        let txtDesc = new TextView(context);
        await txtDesc.setText(view.desc);
        await txtDesc.setSingleLine(true);
        await linContainer.addView(txtDesc);
        
        // ATRIBUTOS
        let txtAttributes = new TextView(context);
        txtAttributes.setTextColor('#C3CB6B');
        txtAttributes.setMarginTop('10px');
        await txtAttributes.setText("ATRIBUTOS");
        await linContainer.addView(txtAttributes);
        
        // METODOS
        let txtMethods = new TextView(context);
        txtMethods.setTextColor('#C3CB6B');
        txtMethods.setMarginTop('10px');
        await txtMethods.setText("METODOS");
        await linContainer.addView(txtMethods);
        
        // EXAMPLES
        let txtExamples = new TextView(context);
        txtExamples.setTextColor('#C3CB6B');
        txtExamples.setMarginTop('10px');
        await txtExamples.setText("EJEMPLOS");
        await linContainer.addView(txtExamples);
        
        // VIEWS EXAMPLES
        for(let itemExample of view.examples){
            let linRow = new LinearLayout(context);
            linRow.setOrientation('horizontal');
            
            // LABEL
            let txtPreview = new TextView(context);
            txtPreview.setMarginTop('10px');
            txtPreview.setSingleLine(true);
            await txtPreview.setText(itemExample.label);
            await linContainer.addView(txtPreview);
            
            // OBTENEMOS EL XML
            
            let httpReqXml = new HttpGet(itemExample.xml);
            let httpRepXml = await httpReqXml.execute();
            let respXml = httpRepXml.getText();
            
            // OBTENEMOS EL JS
            let httpReqJs = new HttpGet(itemExample.js);
            let httpRepJs = await httpReqJs.execute();
            let respJs = httpRepJs.getText();
            
            // Creando la vista
            let fraCont = new FrameLayout(context);
            fraCont.setMarginTop('10px');
            fraCont.setWidth('600px');
//            fraCont.setHeight('150px');
            await fraCont.setBackground('pages/components/imgs/bg_browser.9.png');
            let viewRoot = await LayoutInflater.inflate(context,httpRepXml.getRootElementXml());
            await fraCont.addView(viewRoot);
            await linContainer.addView(fraCont);
            
            // XML
            let linXml = new LinearLayout(context);
            linXml.setOrientation('vertical');
            let txtXml = new TextView(context);
            txtXml.setText('XML');
            await linXml.addView(txtXml);
            let editXml = new EditText(context);
            await editXml.setEms(35);
            await editXml.setLines(5);
            await editXml.setText(respXml);
            await linXml.addView(editXml);
            
            await linRow.addView(linXml);
            
            // JS
            let linJs = new LinearLayout(context);
            linJs.setOrientation('vertical');
            let txtJs = new TextView(context);
            txtJs.setText('JS');
            await linJs.addView(txtJs);
            let editJs = new EditText(context);
            await editJs.setEms(35);
            await editJs.setLines(5);
            await editJs.setText(respJs);
            await linJs.addView(editJs);
            
            await linRow.addView(linJs);
            
            await linContainer.addView(linRow);
            result.scripts.push(respJs);
        }
        result.view = linContainer;
        return result;
    }
    async executeAllScript(scripts){
        for(let script of scripts)
            eval(script);
    }
}