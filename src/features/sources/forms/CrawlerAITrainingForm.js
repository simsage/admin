import React from "react";

export default function CrawlerAITrainingForm(props) {

    return (
        <div className="px-5 py-4" style={{maxHeight: "600px", overflow: "auto"}}>

            {/* AI training switch and explanation */}
            <div className="row mb-4 border-bottom">

                <div className="form-group col-4">
                    <label className="small">Use this Source for Generating AI Training Data</label>
                    <div className="form-check form-switch"
                         title="Enable to establish active directory connection">
                        <input className="form-check-input"
                               type="checkbox" {...props.register("useInTraining")}
                        />
                    </div>
                </div>

                <div className="col-8">
                    <div className="alert alert-warning small py-2" role="alert">
                        Sources can opt-in for generating AI Training Data.  This enables your
                        organisation to use data from this Source (all its files) to be used for
                        training your own Generative AI models.
                    </div>
                </div>

            </div>

            {/* Security Settings */}
            <div className="row mb-2">
            </div>

            {/* HashTag rules filter */}
            <div className="row mb-2">

            </div>



        </div>
    )
}
