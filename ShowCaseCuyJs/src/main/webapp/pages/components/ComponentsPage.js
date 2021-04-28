/* global LayoutInflater, DescriptionCreator, Resource, Toast */

class ComponentsPage extends Page {
    constructor(context) {
        super(context);
        this.setContentView("pages/components/ComponentsLayout.xml");
    }
    
    async onStart(){
        await Resource.import('pages/components/DescriptionCreator.js');
        this.fraContainer = this.findViewById('fraContainer');
        
        let json = await DescriptionCreator.getJson('pages/components/textView.json');
        let result = await this.create(this,json);
        await this.fraContainer.setFirstChild(result.view);
        await this.executeAllScript(result.scripts);
    }
    
    async onClickTextView(){
        let json = await DescriptionCreator.getJson('pages/components/textView.json');
        let result = await this.create(this,json);
        await this.fraContainer.setFirstChild(result.view);
        await this.executeAllScript(result.scripts);
    }
    
    async onClickButton(){
        let json = await DescriptionCreator.getJson('pages/components/button.json');
        let result = await this.create(this,json);
        await this.fraContainer.setFirstChild(result.view);
        await this.executeAllScript(result.scripts);
    }
    
    async onClickLinkButton(){
        let json = await DescriptionCreator.getJson('pages/components/linkbutton.json');
        let result = await this.create(this,json);
        await this.fraContainer.setFirstChild(result.view);
        await this.executeAllScript(result.scripts);
    }
    
    async onClickDialog(){
        let json = await DescriptionCreator.getJson('pages/components/dialog.json');
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
            // Titulo ejemplo
            let txtPreview = new TextView(context);
            txtPreview.setMarginTop('10px');
            txtPreview.setSingleLine(true);
            await txtPreview.setDrawableLeft("pages/components/imgs/ic_vinieta.png");
            txtPreview.setIconWidth('18px');
            txtPreview.setIconHeight('35px');
            await txtPreview.setText(itemExample.label);
            await linContainer.addView(txtPreview);
            
            // Controles
            
            // Prevista
            let fraCont = new FrameLayout(context);
            fraCont.setMarginTop('10px');
            fraCont.setWidth('670px');
            fraCont.setHeight('70px');
            await fraCont.setBackground('pages/components/imgs/bg_browser.9.png');
            let itemXml =  itemExample.sources.find((item)=>item.type === "xml" && item.coupling_mode==="inflate");
            let httpReqXml = new HttpGet(itemXml.url);
            let httpRepXml = await httpReqXml.execute();
            let viewRoot = await LayoutInflater.inflate(context,httpRepXml.getRootElementXml());
            await fraCont.addView(viewRoot);
            await linContainer.addView(fraCont);
            
            // Codigo fuente
            let tabLayout = new TabLayout(context);
            tabLayout.setMarginTop('10px');
            for(let itemXml of itemExample.sources){
                if(itemXml.coupling_mode==='resource'){
                    await Resource.import(itemXml.url);
                }
                let fileName = itemXml.url.substring(itemXml.url.lastIndexOf('/'));
                let httpReqXml = new HttpGet(itemXml.url);
                let httpRepXml = await httpReqXml.execute();
                let text = httpRepXml.getText();

                if(itemXml.coupling_mode==='script'){
                    result.scripts.push(text);
                }

                let editXml = new EditText(context);
                editXml.setWidth('match_parent');
                await editXml.setEms(60);
                await editXml.setLines(5);
                await editXml.setText(text);

                await tabLayout.addTab(editXml,fileName);
            }
            await linContainer.addView(tabLayout);
        }
        result.view = linContainer;
        return result;
    }
    async executeAllScript(scripts){
        for(let script of scripts){
            eval(`(async () => {${script}})()`);
        }
    }
}